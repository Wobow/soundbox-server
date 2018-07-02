import resource from 'resource-router-middleware';
import User from '../models/users';
import Lobbies from '../models/lobby';
import APIError from '../error';
import express from 'express';
import helpers from '../helpers';
import Lobby from '../models/lobby';
import multer from 'multer';
import path from 'path';
import lobbyBean from '../beans/lobby.beans';

const router = express.Router();

const storage = multer.diskStorage({
	destination: './dist/public/images',
	filename: function(req, file, callback) {
		callback(null, 'profile-' + Date.now() + path.extname(file.originalname));
	}
});
export const users = ({ config, db }) => {


  router.get('/me', (req, res, next) => {
    Lobby
      .find({users: {$elemMatch: {user: req.user._id}}})
      .then((lobbies) => {
        const lol = JSON.parse(JSON.stringify(req.user));
        lol.lobbies = lobbies;
        res.json(lol);
      })
      .catch((err) => next(APIError.from(err, 'Could not fetch rooms'), 404));
  });
  router.get('/:id', (req, res, next) => {
    User
      .findById(req.params.id)
      .then((user) => res.json(user))
      .catch((err) => next(APIError.from(err, 'User not found', 404)));    
  });
  router.put('/:id',  multer({ storage }).fields([
    {name: 'image', maxCount: 1}, 
    {name: 'username', maxCount: 1},
    {name: 'password', maxCount: 1},
  ]), (req, res, next) => {
    if (req.params.id !== req.user._id.toString()) {
      return next(new APIError('This is not your profile.', null, 401));
    }
    User
      .findById(req.params.id)
      .then((user) => {
        if (req.body && req.body.username && req.body.username !== user.username) {
          user.username = req.body.username;
        }
        if (req.files && req.files.image && req.files.image.length) {
          user.avatar = req.files.image[0].filename;
        }
        if (req.body.password) {
          user.setPassword(req.body.password, () => {
            user.save().then((user) => res.status(200).json(user))
          });
        }
      })
      .catch((err) => next(APIError.from(err, 'User not found', 404)));    
  });
  router.delete('/:id', (req, res, next) => {
    if (req.params.id !== req.user._id.toString()) {
      return next(new APIError('This is not your profile.', null, 401));
    }
    User.deleteOne({_id: req.params.id})
      .then(() => lobbyBean.removeUserFromLobbies(req.params.id))
      .then(() => lobbyBean.removeLobbiesWithNoUser())
      .then((deletedLobbys) => lobbyBean.removeCommandsRelatedTo(deletedLobbys))
      .then(() => res.status(204).send())
      .catch((err) => {
        console.error(err);
        res.status(203).send();
      });
  });
  return router;
};
export default users;