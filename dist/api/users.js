'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _resourceRouterMiddleware = require('resource-router-middleware');

var _resourceRouterMiddleware2 = _interopRequireDefault(_resourceRouterMiddleware);

var _users = require('../models/users');

var _users2 = _interopRequireDefault(_users);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _error = require('../error');

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;
  return (0, _resourceRouterMiddleware2.default)({
    id: 'users',

    /** GET / - List all entities */
    index: function index(_ref2, res) {
      var params = _ref2.params;

      _users2.default.find().then(function (users) {
        return res.json(users);
      }).catch(function (err) {
        return new _error2.default('Une erreur est survenue', err, 500).send();
      });
    }
  });
};
//# sourceMappingURL=users.js.map