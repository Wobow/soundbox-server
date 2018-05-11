import resource from 'resource-router-middleware';
import User from '../models/users';
import APIError from '../error';
import express from 'express';
import helpers from '../helpers';
import Lobby from '../models/lobby';

const router = express.Router();

export const users = ({ config, db }) => {


  router.get('/me', (req, res, next) => {
    Lobby
      .find({users: {$elemMatch: {user: req.user._id}}})
      .then((lobbies) => {
        const lol = JSON.parse(JSON.stringify(req.user));
        lol.lobbies = lobbies;
        res.json(lol);
      })
      .catch((err) => next(APIError.from(err, 'Could not fetch rooms'), 404));
  });
  router.get('/:id', (req, res, next) => {
    User
      .findById(req.params.id)
      .then((user) => res.json(user))
      .catch((err) => next(APIError.from(err, 'User not found', 404)));    
  });
  return router;
};
export default users;