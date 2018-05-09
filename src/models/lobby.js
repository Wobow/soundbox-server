import mongoose from 'mongoose';

const lobbySchema = mongoose.Schema({
  name: String,
  // invites: Invite,
  // users: Users,
  commands: [{ref: 'Command', type: mongoose.Schema.Types.ObjectId}] 
});

export default mongoose.model('Lobby', lobbySchema);
