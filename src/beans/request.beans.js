import RequestResponse from '../models/requestResponse';
import APIError from '../error';

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
      let treatFunction;
      switch (request.type) {
        case 'joinLobby':
        treatFunction = this.requestJoinLobby;
        break;
        default:
        throw new APIError('Not implemented', null, 404);
      }
      treatFunction(request).then((response) => resolve(response));
    });
  },

  requestJoinGame(request) {

  },

  requestCreateGame(request) {

  },

  async requestJoinLobby(request) {
    console.log('requestlobby');
    return true;
  },

  requestInvitePlayer(request) {

  },
}