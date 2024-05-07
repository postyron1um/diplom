import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant',
    required: true,
  },
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  wins: {
    type: Number,
    default: 0,
  },
  draws: {
    type: Number,
    default: 0,
  },
  losses: {
    type: Number,
    default: 0,
  },
  matches: {
    type: Number,
    default: 0,
  },
  goalsFor: {
    type: Number,
    default: 0,
  },
  goalsAgainst: {
    type: Number,
    default: 0,
  },
});

const Player = mongoose.model('Player', playerSchema);

export default Player;
