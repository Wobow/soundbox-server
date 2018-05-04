
import WebSocket from 'ws';
import _ from 'lodash';
import Command from './models/command';

export default {


  start(server) {
    this.wss = new WebSocket.Server({ server });
    this.wss.broadcast = (data) => {
      this.wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    };
    this.wss.on('connection', (ws) => {
      ws.send('Hi');
      ws.on('message', (message) => { 
        Command.findOne({_id: message}).then((cmd) => {
          if (cmd) {
            this.wss.broadcast(JSON.stringify(Object.assign(cmd, {time: Date.now()})));
          }
        }).catch((err) => console.error(err));
      });
    });
  }
};