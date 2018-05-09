
import { Router } from 'express';
import auth from './auth';

import { version } from '../../package.json';
import commands from './commands';
import lobbies from './lobbies';

export default ({ config, db }) => {
  const api = Router();

  api.use('/auth', auth({ config, db }));
  api.use('/commands', commands({ config, db }));
  api.use('/lobbies', lobbies({ config, db }));


  api.get('/', (req, res) => {
    res.json({ version });
  });

  return api;
};
