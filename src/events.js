import APIError from "./error";
import User from './models/users';
import Command from './models/command';
import Lobby from './models/lobby';
import Events from './models/events';
import mongoose from "mongoose";


export default {
  logEvent: (type, user, lobby = undefined, command = undefined, userRef = undefined) => {
    const event = new Events({
      type,
      user,
      lobby,
      command,
      userRef,
      time: Date.now(),
    });
    return event.save();
  },

};
