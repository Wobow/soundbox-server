import mongoose from 'mongoose';

const gamesSchema = mongoose.Schema({
  lobby: {type: mongoose.SchemaTypes.ObjectId, ref: 'Lobby'},
  players: [{type: mongoose.SchemaTypes.ObjectId, ref: 'User'}],
  spectators: [{type: mongoose.SchemaTypes.ObjectId, ref: 'User'}],
  status: String,
  gameState: Number,
  turn: {type: mongoose.SchemaTypes.ObjectId, ref: 'User'}
});

export default mongoose.model('Game', gamesSchema);
