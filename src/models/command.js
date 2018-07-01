import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const commandSchema = mongoose.Schema({
  name: String,
  lobby: {type: mongoose.Schema.Types.ObjectId, ref: 'Lobby'},
  url: String,
  played: { type: Number, default: 0},
});

export default mongoose.model('Command', commandSchema);
