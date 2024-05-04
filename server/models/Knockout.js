// match.model.js

import mongoose from 'mongoose';


const matchSchema = new mongoose.Schema({
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true,
  },
  round: {
    type: Number,
    required: true,
  },
  team1: {
    type: String,
    required: true,
  },
  team2: {
    type: String,
    required: true,
  },
  score1: {
    type: Number,
    default: 0,
  },
  score2: {
    type: Number,
    default: 0,
  },
	previousScore1: {
    type: Number,
    default: 0
  },
  previousScore2: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Match = mongoose.model('Match', matchSchema);
export default Match;
