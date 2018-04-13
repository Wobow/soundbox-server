import resource from 'resource-router-middleware';
import User from '../models/users';
import APIError from '../error';
import express from 'express';
import helpers from '../helpers';

const router = express.Router();

export const users = ({ config, db }) => {

  /** GET / - List all entities */
  router.get('/', (req, res, next) => {
    User
      .find()
      .then(users => res.json(users))
      .catch((err) => next(new APIError('Cannot load user list', err, 500)));
  });

  /** GET /:id - List all entities */
  router.get('/:id', (req, res, next) => {
    User
      .findOne({_id: req.params.id})
      .then(user => {
        if (!user) { throw new APIError('User not found', null, 404) }
        res.json(user)
      })
      .catch((err) => next(APIError.from(err, 'Cannot load user')));
  });

  /** PUT /:id - Updates one user */
  router.put('/:id', helpers.isConnectedUserPermissionHandler, (req, res, next) => {
    User
      .findOne({_id: req.params.id})
      .then((user) => {
        if (!user) throw new APIError('User not found', null, 404);
        for (let key in req.body) {
          if (key !== '_id') {
            user[key] = req.body[key];
          }
        }
        return user.save();
      })
      .then((user) => {
        res.status(200).json(user);
      })
      .catch(err => next(APIError.from(err, 'Cannot update user. It is probably because another user with this username already exists', 409)));
  });

  return router;
};

export default users;