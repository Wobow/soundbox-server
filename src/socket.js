
import WebSocket from 'ws';
import _ from 'lodash';
import SocketWorker from './workers/web-sockets.worker';

export default {


  handleConnection(ws) {
    ws.send('Hi');
    ws.on('message', (message) => { 
      try {
        const content = JSON.parse(message);
        if (!content) {
          throw new Error('Bad JSON format');
        }
        if (content.userId) {
          SocketWorker.subscribe(content, ws);
        } else {
          SocketWorker.send(ws, 'You must provide userId and secret');
        }

      } catch (err) {
        SocketWorker.send(ws, err.message);
      } 
    });
  },

  start(server) {
    this.wss = new WebSocket.Server({ server });
    this.wss.on('connection', this.handleConnection);
  }
};