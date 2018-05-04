
import WebSocket from 'ws';
import _ from 'lodash';
import Command from './models/command';
import io from 'socket.io';

export default {
  start(server) {

    this.wss = io(server);
    this.wss.on('connection', (socket) => {

      socket.on('message', (message) => {
        Command
          .findOne({ _id: JSON.parse(message) })
          .then((cmd) => {
            if (cmd) {
              this.wss.emit('broadcast', JSON.stringify(Object.assign(cmd, { time: Date.now() })));
            }
          })
          .catch((err) => console.error(err));
      });
    });
  }
};