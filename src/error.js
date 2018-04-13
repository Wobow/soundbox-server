export default class APIError {

  /**
   * Creates an error object to be consistent thoughout the api
   * @param {string} message 
   * @param {number} statusCode 
   * @param {any} stack
   */
  constructor(message, stack = {}, statusCode = 500) {
    this.message = message;
    this.status = statusCode;
    this.stack = stack;
  }

  send(res) {
    res.status(this.status);
    res.json({
      message: this.message,
      status: this.status,
      stackTrace: this.stack
    });
  }
}