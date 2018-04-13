import resource from 'resource-router-middleware';
import Users from '../models/users';
import mongoose from 'mongoose';
import APIError from '../error';

export default ({ config, db }) => resource({
  id: 'users',

  /** GET / - List all entities */
  index({ params }, res) {
    Users
      .find()
      .then(users => res.json(users))
      .catch((err) => new APIError('Une erreur est survenue', err, 500).send());
  },
});
