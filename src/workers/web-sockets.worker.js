
import _ from 'lodash';
import User from '../models/users';

export default {

  connections: {},

  send(ws, msg, todelete = null) {
    try {
      ws.send(msg);
    } catch (err) {
      if (todelete && this.connections[todelete.userID] && this.connections[todelete.userID].length >= todelete.idx) {
        console.log('connection deleted');
        _.pullAt(this.connections[todelete.userID], todelete.idx);
      }
    }
  },

  notifyUser(userID, objToSend) {
    if (!this.connections[userID] || !this.connections[userID].length) {
      console.log('No socket to use');
      return;
    }
    this.connections[userID].forEach((ws, idx) => {
      this.send(ws, JSON.stringify(objToSend), {userID, idx});
    });
  },

  async subscribe(content, ws) {
    const user = await User.findById(content.userId)
    if (!user) {
      return SocketWorker.send(ws, 'No such user');
    }
    if (!this.connections[content.userId]) {
      this.connections[content.userId] = [];
    }
    this.connections[content.userId].push(ws);
    this.send(ws, 'ok');
    console.log('User subscribed a socket');
  },
};