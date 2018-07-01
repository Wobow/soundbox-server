import mongoose from 'mongoose';

const invitesSchema = mongoose.Schema({
    expiresAt: Number,
    code: {
      unique: true,
      type: String,
    },
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    lobby: {type: mongoose.Schema.Types.ObjectId, ref: 'Lobby'},
});

export default mongoose.model('Invite', invitesSchema);
