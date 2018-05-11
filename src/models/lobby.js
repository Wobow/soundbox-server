import mongoose from 'mongoose';

const lobbySchema = mongoose.Schema({
  name: String,
  // invites: Invite,
  users: [{
    user: {ref: 'User', type: mongoose.Schema.Types.ObjectId},
    role: String,
    joinedAt: Date,
  }],
  commands: [{ref: 'Command', type: mongoose.Schema.Types.ObjectId}],
});

export default mongoose.model('Lobby', lobbySchema);
