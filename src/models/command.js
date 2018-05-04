import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const commandSchema = mongoose.Schema({
  name: String,
  url: String
});

export default mongoose.model('Command', commandSchema);
