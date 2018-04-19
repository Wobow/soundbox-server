export default class RequestResponse {
  
  /**
   * Instantiates a new response for the requests
   * 
   * @param {string} requestId The id of the request it is attached to
   * @param {string} message The message to display
   * @param {number} statusCode The code of the response as defined in the doc
   */
  constructor(requestId, message, statusCode) {
    this.requestId = requestId;
    this.message = message;
    this.statusCode = statusCode;
  }
}