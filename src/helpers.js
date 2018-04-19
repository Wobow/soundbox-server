import APIError from "./error";
import User from './models/users';
import Lobby from './models/lobbies';
import mongoose from "mongoose";

export const wrapInPromise = (value) => {
  return new Promise((resolve) => resolve(value));
};

export default {
  checkBody: (body, bodyParams) => {
    bodyParams.forEach(key => {
      if (!body[key] || !body[key].length) {
        throw new APIError(`Field '${key}' is missing.`, null, 400);
      }
    });
  },

  safeUser: (source) => {
    const out = JSON.parse(JSON.stringify(source));
    delete out.hash;
    delete out.salt;
    return out;
  },

  isConnectedUserPermissionHandler: (req, res, next) => {
    if (req.user._id == req.params.id) return next();
    return next(new APIError('Forbidden', 'You cannot perform this action on this resource as it is not yours', 403));
  },

  isNotInLobby: (userId) => {
    return User
      .findById(userId)
      .then((user) => {
        if (user.lobby) {
          throw new Error('Already in lobby');
        }
        return true;
      })
  },

  hasNotAlreadyCreatedLobby: (userId, maxNumberOfLobbies = 1) => {
    if (!userId) {
      throw new Error('No user provided');
    }
    return Lobby
      .count({creator: userId})
      .then((number) => {
        if (number >= maxNumberOfLobbies) {
          throw new APIError('You have reached the maximum number of lobbies that you can create', null, 403);
        }
        return wrapInPromise(true);
      });
  },

  userIsCreatorOfLobby: (userId, lobbyId) => {
    return Lobby
      .findOne({_id: lobbyId})
      .then((lobby) => {
        if (!lobby) {
          throw new APIError('Lobby not found', null, 404);
        }
        if (lobby.creator.toString() != userId) {
          throw new APIError('Only the owner of the lobby can delete it', null, 403);
        }
        return wrapInPromise(lobby);
      });
  },
};
