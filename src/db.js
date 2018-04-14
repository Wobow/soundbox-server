import mongoose from 'mongoose';
import config from './config';

export default (callback) => {
  mongoose.connect(config.mongoDB);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    // we're connected!
    console.log('database connected : ', config.mongoDB);
    callback(db);
  });
};
