import express from 'express';
import User from '../models/users';
import APIError from '../error';
import helpers from '../helpers';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const router = express.Router();

export default ({ config, db }) => {

  // POST /api/auth/login
  router.post('/login', (req, res, next) => {
    helpers.checkBody(req.body, ['username', 'password']);
    User.authenticate()(req.body.username, req.body.password)
      .then(user => {
        if (user.user) {
          return res.json({
                        user: helpers.safeUser(user.user),
                        token: jwt.sign(helpers.safeUser(user.user), config.secret)
                      });
        } else {
          throw new APIError('Incorrect password or username', null, 401);
        }
      })
      .catch(err => next(APIError.from(err, 'Cannot log in user')));
  });

  // POST /api/auth/register
  router.post('/register', (req, res, next) => {
    helpers.checkBody(req.body, ['username', 'password']);
    const user = new User({ username: req.body.username, creationDate: Date.now() });
    User.count({ username: req.body.username })
      .then(userCount => {
        if (userCount) {
          throw new APIError('This username is already used', null, 409);
        } else {
          return user.setPassword(req.body.password)
        }
      })
      .then(() => user.save())
      .then(() => User.authenticate()(req.body.username, req.body.password))
      .then(user => res.json({
        user: helpers.safeUser(user.user),
        token: jwt.sign(helpers.safeUser(user.user), config.secret)
      }))
      .catch(err => {
        next(APIError.from(err, 'An error occurred while registration'));
      });
  });

  return router;
};

