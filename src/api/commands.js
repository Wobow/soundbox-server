import resource from 'resource-router-middleware';
import User from '../models/users';
import APIError from '../error';
import express from 'express';
import helpers from '../helpers';
import Command from '../models/command';
import Lobby from '../models/lobby';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
	destination: './dist/public/commands',
	filename: function(req, file, callback) {
		callback(null, 'command-' + Date.now() + path.extname(file.originalname));
	}
});

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

  router.post('/', multer({ storage }).fields([
    {name: 'file', maxCount: 1}, 
    {name: 'name', maxCount: 1}, 
    {name: 'lobby', maxCount: 1}
  ]),
  (req, res, next) => {
    helpers.checkBody(req.body, ['name', 'lobby']);
    Lobby.findById(req.body.lobby)
      .then((lobby) => {
        const body = {
          name: req.body.name,
          lobby,
          url: req.files.file[0].filename,
        };
        const newCommand = new Command(body);
        return newCommand.save();
      })
      .then((response) => {
        res.json(response);
      })
      .catch((err) => next(APIError.from(err, 'Could not save command', 400)));
});
  
  return router;
};


export default commands;