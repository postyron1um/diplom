import mongoose from 'mongoose'

const TournamentParticipantSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username:{
    type: String,
    required:true,
  },
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  }
});

const TournamentParticipant = mongoose.model('TournamentParticipant',TournamentParticipantSchema);

export default TournamentParticipant;
