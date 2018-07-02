import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  hash: String,
  salt: String,
  modificationDate: Date,
  creationDate: Date,
  avatar: String,
});

userSchema.plugin(passportLocalMongoose);

userSchema.pre('update', function() {
  this.modificationDate = Date.now();
});
export default mongoose.model('User', userSchema);
