import resource from 'resource-router-middleware';
import User from '../models/users';
import APIError from '../error';
import express from 'express';
import helpers from '../helpers';
import Invites from '../models/invites';
import Lobby from '../models/lobby';
import multer from 'multer';
import path from 'path';

const router = express.Router();

export const invites = ({ config, db }) => {
  
  router.get('/:id', (req, res, next) => {
    Invites.findOne({code: req.params.id}).populate('lobby')
    .then((invite) => {
      if (!invite) {
        throw new APIError('Invite not found', null, 404);
      }
      return res.json(invite);
    })
    .catch((err) => next(APIError.from(err, 'Invite not found', 404)))
  });
  return router;
};


export default invites;