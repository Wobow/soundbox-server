'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _users = require('./users');

var _users2 = _interopRequireDefault(_users);

var _package = require('../../package.json');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  api.use('/users', (0, _users2.default)({ config: config, db: db }));

  api.get('/', function (req, res) {
    res.json({ version: _package.version });
  });

  return api;
};
//# sourceMappingURL=index.js.map