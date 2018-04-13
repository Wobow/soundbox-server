import mongoose from 'mongoose';

var userSchema = mongoose.Schema({
  username: String,
});
export default mongoose.model('Users', userSchema);
