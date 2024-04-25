import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: [{ type: String, ref: 'Role' }],
    participatedTournaments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tournament' }],
  },
  
);

export default mongoose.model('User', UserSchema);