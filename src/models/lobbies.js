import mongoose from 'mongoose';

const lobbySchema = mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  games: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Games' }],
  name: String,
  maxPlayers: {default: 100, type: Number},
  password: {required: false, type: String},
});

export default mongoose.model('Lobby', lobbySchema);
