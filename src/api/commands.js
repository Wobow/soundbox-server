import resource from 'resource-router-middleware';
import User from '../models/users';
import APIError from '../error';
import express from 'express';
import helpers from '../helpers';
import Command from '../models/command';

const router = express.Router();

export const commands = ({ config, db }) => {
  
  router.get('/', (req, res, next) => {
    Command.find()
    .then((commands) => {
      if (!commands) {
        throw new APIError('Commands not found, or you do not have permission to access', null, 404);
      }
      return res.json(commands);
    })
    .catch((err) => next(APIError.from(err, 'Commands not found', 404)))
  });

  /*router.get('/:rid', (req, res, next) => {
    Request.findOne({
      _id: req.params.id,
      author: req.user.id
    })
    .then((request) => {
      if (!request) {
        throw new APIError('Request not found, or you do not have permission to access', null, 404);
      }
      return res.json(request);
    })
    .catch((err) => next(APIError.from(err, 'Request not found', 404)))
  });*/

  router.post('/', (req, res, next) => {
    helpers.checkBody(req.body, ['name', 'url']);
    const newCommand = new Command(req.body);
    newCommand
      .save()
      .then((response) => {
        res.json(response);
      })
      .catch((err) => next(APIError.from(err, 'Could not save command', 400)));
  });
  
  return router;
};


export default commands;