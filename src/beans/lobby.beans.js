import resource from 'resource-router-middleware';
import User from '../models/users';
import Lobbies from '../models/lobby';
import APIError from '../error';
import express from 'express';
import helpers from '../helpers';
import Lobby from '../models/lobby';
import multer from 'multer';
import path from 'path';
import mongoose from "mongoose";
import Command from '../models/command';

export default {
  removeUserFromLobbies: (user) => {
    console.log('removing user from lobbies : ', user);
    return Lobbies.update(  
      { },
      { $pull: { users: { user  } } },
      { multi: true }
    );
  },

  removeLobbiesWithNoUser: () => {
    let deletedLobbiesIds;
    console.log('removeing empty lobbies');
    return Lobbies.find({ 'users': { $size: 0 } })
    .then((lobbies) => {
      deletedLobbiesIds = lobbies.map((l) => l._id);
      console.log('removing following lobbies :', deletedLobbiesIds);
      return Lobbies.deleteMany({_id: {$in: deletedLobbiesIds}});
    })
    .then(() => deletedLobbiesIds);
  },

  removeCommandsRelatedTo: (lobbiesIds) => {
    console.log('removing orphan commands :', lobbiesIds);
    return Command.deleteMany({lobby: {$in: lobbiesIds}});
  }

};