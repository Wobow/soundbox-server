
import { Router } from 'express';
import auth from './auth';
import * as UserResources from './users';

import { version } from '../../package.json';
import passport from 'passport';

export default ({ config, db }) => {
  const api = Router();

  api.use('/auth', auth({ config, db }));
  api.use('/users', passport.authenticate('jwt', {session: false}), UserResources.users({ config, db }));

  api.get('/', (req, res) => {
    res.json({ version });
  });

  return api;
};
