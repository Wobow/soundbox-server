
import WebSocket from 'ws';
import _ from 'lodash';
import Command from './models/command';
import User from './models/users';
import Lobby from './models/lobby';
import Events  from './models/events';
import io from 'socket.io';
import { Promise } from 'mongoose';
import events from './events';
import helpers from './helpers';

const DEFAULT_INTERVAL = 5;

export default {

  start(server) {
    this.wss = io(server);
    this.wss.on('connection', (socket) => {

      socket.on('message', (message) => {
        try {
          const msg = JSON.parse(message);
          if (this.checkBody(msg)) {
            this.handleMessage(msg);
          }
        } catch (err) {
          console.error(err);
        }
      });
    });

    this.handleMessage = (message) => {
      Promise.all([
        Lobby.findById(message.serverId),
        User.findById(message.userId)
      ])
      .then((lobbyAndUser) => this.shouldBroadcastSound(lobbyAndUser[0], lobbyAndUser[1]))
      .then((shouldBroadCast) => shouldBroadCast ? this.broadCastSound(message) : 0)
      .catch((err) => console.error(err));
    }

    this.checkBody = (body) => {
      return body && body.userId && body.serverId && body.commandId;
    }

    this.checkSlowMode = (lobby, user) => {
      return Events.find(
        { lobby, user }, 
        undefined, 
        {
          sort: {
            time: -1
          },
          limit: 1
        }
      )
      .then((events) => {
        if (!events || !events.length) { return true; }
        const slowModeOptions = helpers.checkLobbyRule(lobby, 'slow').options;
        const interval = (slowModeOptions ? slowModeOptions.interval || DEFAULT_INTERVAL : DEFAULT_INTERVAL) * 1000;
        if (events[0].time.getTime() + interval > new Date(Date.now()).getTime()) { return false; } 
        return true;
      });
    }

    this.shouldBroadcastSound = (lobby, user) => {
      if (!lobby.users.find((u) => u.user.toString() === user._id.toString())) {
        console.log('User is not in lobby');
        return false;
      }
      if (helpers.checkLobbyRule(lobby, 'offline').active) {
        console.log('Lobby is offline');
        return false;
      }
      if (helpers.checkLobbyRule(lobby, 'slow').active) {
        console.log('User is not yet allowed to broadcast');
        return this.checkSlowMode(lobby, user);
      } else {
        return true;
      }
    }

    this.silentlyLogEvent = (message) => {
      try {
        events.logEvent('play', message.userId, message.serverId, message.commandId);
      } catch (err) {
        console.error('Event was not logged');
      }
    }

    this.broadCastSound = (message) => {
      this.silentlyLogEvent(message);
      Command
        .findOneAndUpdate({ _id: message.commandId }, {$inc: {played: 1}})
        .then((cmd) => {
          if (cmd) {
            this.wss.emit('broadcast', JSON.stringify(Object.assign(cmd, { time: Date.now() })));
          }
        })
        .catch((err) => console.error(err));
    }
  }
}
