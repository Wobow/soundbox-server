"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var APIError = function () {

  /**
   * Creates an error object to be consistent thoughout the api
   * @param {string} message 
   * @param {number} statusCode 
   * @param {any} stack
   */
  function APIError(message) {
    var stack = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var statusCode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 500;

    _classCallCheck(this, APIError);

    this.message = message;
    this.status = statusCode;
    this.stack = stack;
  }

  _createClass(APIError, [{
    key: "send",
    value: function send(res) {
      res.status(this.status);
      res.json({
        message: this.message,
        status: this.status,
        stackTrace: this.stack
      });
    }
  }]);

  return APIError;
}();

exports.default = APIError;
//# sourceMappingURL=error.js.map