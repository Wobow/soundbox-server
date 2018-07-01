import resource from 'resource-router-middleware';
import User from '../models/users';
import APIError from '../error';
import express from 'express';
import helpers from '../helpers';
import Lobbies from '../models/lobby';
import Invite from '../models/invites';
import Command from '../models/command';

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
  router.get('/:id', (req, res, next) => {
    Lobbies.findById(req.params.id).populate('users.user')
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
    const lobby = new Lobbies({ name: req.body.name, users: [{user: req.user._id, role: 'creator', joinedAt: Date.now()}] });
    lobby
      .save()
      .then((lobby) => {
        return res.status(201).json(lobby);
      })
      .catch((err) => next(APIError.from(err, 'Could not create lobby', 500)));
  });
  router.post('/join', async (req, res, next) => {
    helpers.checkBody(req.body, ['code']);
    const invite = await Invite.findOne({code: req.body.code});
    if (!invite) {
      return new APIError('This invite does not exist', null, 404).send(res);
    }
    const lobby = await Lobbies.findById(invite.lobby);
    if (!lobby) {
      return new APIError('The server does not exist anymore', null, 404).send(res);
    }
    if (invite.expiresAt < Date.now()) {
      return new APIError('This invite has expired', null, 403).send(res);
    }
    if (lobby.users.findIndex((u) => u.user == req.user._id.toString()) > -1) {
      return new APIError('You are already in this lobby', null, 409).send(res);
    }
    lobby.users.push({user: req.user._id, role: 'member', joinedAt: Date.now()})
    lobby
      .save()
      .then((lobbySaved) => res.json(lobby))
      .catch((err) => APIError.from(err, 'Could not add you to the lobby', 500));
  });

  router.post('/:id/invites', (req, res, next) => {
    helpers.checkBody(req.body, ['expiresAt', 'code']);
    const invite = new Invite({expiresAt: req.body.expiresAt, code: req.body.code, author: req.user._id});
    Lobbies
      .findById(req.params.id)
      .then((lobby) => {
        if (!lobby) {
          return new APIError('Lobby not found', null, 404).throw();
        }
        invite.lobby = lobby._id;
        return invite.save();
      })
      .then((inviteSaved) => res.json(inviteSaved))
      .catch((err) => next(APIError.from(err, undefined, 400)));
  });

  router.get('/:lid/commands', (req, res, next) => {
    Lobbies.findById(req.params.lid).populate('users.user')
    .then((lobby) => {
      if (!lobby) {
        throw new APIError('Lobbies not found, or you do not have permission to access', null, 404);
      }
      return Command.find({ lobby });
    })
    .then((commands) => {
      return res.send(commands);
    })
    .catch((err) => next(APIError.from(err, 'Lobbies not found', 404)))
  });

  router.delete('/:lid', (req, res, next) => {
    Lobbies.findByIdAndRemove(req.params.id)
      .then(() => res.status(204).send())
      .catch((err) => next(APIError.from(err, 'Could not delete lobby', 403)));
  });
  
  return router;
};


export default commands;