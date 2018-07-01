import mongoose from 'mongoose';

const eventsSchema = mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  lobby: {type: mongoose.Schema.Types.ObjectId, ref: 'Lobby'},
  command: {type: mongoose.Schema.Types.ObjectId, ref: 'Command'},
  type: 'played' | 'is-banned' | 'has-banned',
  time: Date 
});

export default mongoose.model('Events', eventsSchema);
