'use strict';

import RequestResponse from '../models/requestResponse';
import APIError from '../error';
import requestQueue from '../workers/requests-queue.worker';
import Lobby from '../models/lobbies';
import User from '../models/users';

export default {

  allowedTypes: ['joinGame', 'createGame', 'joinLobby', 'invitePlayer'],
  /**
   * Verifies if a request type is valid
   * @param {string} type the type to check
   */
  checkType(type) {
    if (this.allowedTypes.findIndex((t) => t === type) === -1) {
      throw new APIError(`Type '${type}' is not a valid type. Type should be one of the following : ${this.allowedTypes.join(', ')}`, null, 400);
    }
  },

  /**
   * Will treat a request
   * @param {Request} request The request to treat
   * @returns {Promise} The response to the request
   */
  treatRequest(request) {
    return new Promise((resolve, reject) => {
      if (request.status !== 'submitted') {
        reject(new RequestResponse(request._id, 'REQUEST_ALREADY_TREATED', 1));
      }
      requestQueue.push(request);
      resolve(request);
    });
  },

  throwError(requestId, errorMessage, statusCode, status, resourceURI) {
    return new RequestResponse(requestId, errorMessage, statusCode, status, resourceURI);
  },

  /**
   * 
   * @param {Request} request 
   * @returns {RequestResponse} 
   */
  async joinLobby(request) {
    try {
      const lobby = await Lobby.findById(request.accessResource)
      if (!lobby) {
        return this.throwError(request._id, 'Lobby not found', 1101, 'rejected', null);
      }
      if (lobby.users.length >= lobby.maxPlayers) {
        return this.throwError(request._id, 'Lobby is full', 1102, 'rejected', null);
      }
      const user = await User.findById(request.author);
      if (!user) {
        return this.throwError(request._id, 'User not found', 1201, 'rejected', null);
      }
      if (user.lobby) {
        return this.throwError(request._id, 'User is already in a lobby', 1202, 'rejected', `/api/lobbies/${user.lobby}`);
      }
      user.lobby = lobby;
      lobby.users.push(user);
      await user.save();
      await lobby.save();
      return new RequestResponse(request._id, 'Lobby joined', 101, 'ok', `/api/lobbies/${lobby._id}`);
    } catch (err) {
      return this.throwError(request._id, 'Internal Server Error', 1001, 'rejected', null);
    }
  }
}