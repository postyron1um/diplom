import mongoose from 'mongoose';

const knockoutParticipantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true,
  },
  tel: {
    type: String,
    required: true,
  },
});

const KnockoutParticipant = mongoose.model('KnockoutParticipant', knockoutParticipantSchema);

export default KnockoutParticipant;
