
import { Router } from 'express';
import auth from './auth';
import * as UserResources from './users';

import { version } from '../../package.json';
import passport from 'passport';
import { requests } from './requests';
import { lobbies } from './lobbies';

export default ({ config, db }) => {
  const api = Router();

  api.use('/auth', auth({ config, db }));
  api.use('/requests', passport.authenticate('jwt', {session: false}), requests({ config, db }));
  api.use('/users', passport.authenticate('jwt', {session: false}), UserResources.users({ config, db }));
  api.use('/lobbies', passport.authenticate('jwt', {session: false}), lobbies({ config, db }));

  api.get('/', (req, res) => {
    res.json({ version });
  });

  return api;
};
