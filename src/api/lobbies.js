import resource from 'resource-router-middleware';
import User from '../models/users';
import APIError from '../error';
import express from 'express';
import helpers from '../helpers';
import Lobbies from '../models/lobby';

const router = express.Router();

export const commands = ({ config, db }) => {
  
  router.get('/', (req, res, next) => {
    Lobbies.find()
    .then((lobbies) => {
      if (!lobbies) {
        throw new APIError('Lobbies not found, or you do not have permission to access', null, 404);
      }
      return res.json(lobbies);
    })
    .catch((err) => next(APIError.from(err, 'Lobbies not found', 404)))
  });

  router.post('/', (req, res, next) => {
    helpers.checkBody(req.body, ['name']);
    const lobby = new Lobbies({ name: req.body.name });
    lobby
      .save()
      .then((lobby) => {
        return res.status(201).json(lobby);
      })
      .catch((err) => next(APIError.from(err, 'Could not create lobby', 500)));
  });

  router.delete('/:lid', (req, res, next) => {
    Lobbies.findByIdAndRemove(req.params.id)
      .then(() => res.status(204).send())
      .catch((err) => next(APIError.from(err, 'Could not delete lobby', 403)));
  });
  
  return router;
};


export default commands;