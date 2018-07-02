
import { Router } from 'express';
import auth from './auth';

import { version } from '../../package.json';
import commands from './commands';
import lobbies from './lobbies';
import users from './users';
import passport from 'passport';
import { invites } from './invites';

export default ({ config, db }) => {
  const api = Router();

  api.use('/auth', auth({ config, db }));
  api.use('/invites', invites({ config, db }));
  api.use('/users',  passport.authenticate('jwt', {session: false}), users({ config, db }));
  api.use('/commands',  passport.authenticate('jwt', {session: false}), commands({ config, db }));
  api.use('/lobbies',  passport.authenticate('jwt', {session: false}), lobbies({ config, db }));


  api.get('/', (req, res) => {
    res.json({ version });
  });

  return api;
};
