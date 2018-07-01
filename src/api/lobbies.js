import resource from 'resource-router-middleware';
import User from '../models/users';
import APIError from '../error';
import express from 'express';
import helpers from '../helpers';
import Lobbies from '../models/lobby';
import Invite from '../models/invites';
import Command from '../models/command';
import * as _ from 'lodash';

const router = express.Router();
const AUTHORIZED_RULES = ['slow', 'queue', 'offline', 'combo', 'subOnly'];

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

  router.delete('/:lid/commands/:cid', (req, res, next) => {
    Lobbies.findById(req.params.lid).populate('users.user')
    .then((lobby) => {
      // Check permissions
      if (!lobby) {
        throw new APIError('Lobbies not found, or you do not have permission to access', null, 404);
      }
      return Command.deleteOne({ lobby, _id: req.params.cid });
    })
    .then(() => res.status(204).send())
    .catch((err) => next(APIError.from(err, 'Command not found', 404)))
  });

  router.delete('/:lid/users/:uid', (req, res, next) => {
    Lobbies.findById(req.params.lid).populate('users.user')
    .then((lobby) => {
      // Check permissions
      if (!lobby) {
        throw new APIError('Lobbies not found, or you do not have permission to access', null, 404);
      }
      if (req.params.uid !== req.user._id.toString()) {
        throw new APIError('You do not have permission to remove this user from the lobby', null, 403);
      }
      const index = lobby.users.findIndex((u) => u.user._id.toString() === req.params.uid);
      if (index < 0) {
        throw new APIError('User not found in lobby', null, 404);
      }
      _.pullAt(lobby.users, index);
      console.log(lobby);
      return Lobbies.findByIdAndUpdate(lobby._id, {$set: {users: lobby.users}});
    })
    .then(() => res.status(204).send())
    .catch((err) => next(APIError.from(err, 'Command not found', 404)))
  });

  const setRule = (sourceRules, rule) => {
    helpers.checkBody(rule, ['name', 'active']);
    if (!sourceRules) { return [rule] }
    const existingRule = sourceRules.find((r) => r.name === rule.name);
    if (existingRule) { 
      existingRule.options = rule.options;
      existingRule.active = rule.active;
    } else {
      if (!AUTHORIZED_RULES.includes(rule.name)) { throw new APIError(`${rule.name} is not a valid rule.`); }
      sourceRules.push(rule);
    }
    return sourceRules;
  };

  router.put('/:lid/rules', (req, res, next) => {
    helpers.checkBody(req.body, ['rules']);
    Lobbies.findById(req.params.lid).populate('users.user')
    .then((lobby) => {
      if (!lobby) { throw new APIError('Lobby not found, or you do not have permission to access', null, 404); }
      let rules = lobby.rules;
      req.body.rules.forEach((rule) => rules = setRule(rules, rule));
      console.log(rules);
      lobby.rules = rules;
      return lobby.save();
    })
    .then((lobby) => res.json(lobby))
    .catch((err) => next(APIError.from(err, 'Lobby not found', 404)))
  });

  router.delete('/:lid', (req, res, next) => {
    Lobbies.findById(req.params.lid).populate('users.user')
      .then((lobby) => {
        const user = lobby.users.find((u) => u.user._id.toString() === req.user._id.toString());
        if (!user) {
          throw new APIError('You are not allowed to remove this lobby : user not in lobby', null, 403);
        }
        if (user.role !== 'creator') {
          throw new APIError('You are not allowed to remove this lobby : only the creator can do this', null, 403);
        }
        return Lobbies.findByIdAndRemove(req.params.lid);
      })
      .then(() => res.status(204).send())
      .catch((err) => next(APIError.from(err, 'Could not delete lobby', 403)));
  });
  
  return router;
};


export default commands;