import mongoose from 'mongoose';

const Rule = mongoose.Schema({
  name: String,
  options: Object,
  active: Boolean
},{ _id : false });

const lobbySchema = mongoose.Schema({
  name: String,
  users: [{
    user: {ref: 'User', type: mongoose.Schema.Types.ObjectId},
    role: String,
    joinedAt: Date,
  }],
  rules: [Rule],
});


export default mongoose.model('Lobby', lobbySchema);
