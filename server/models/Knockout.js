import mongoose from 'mongoose';

const knockoutMatchSchema = new Schema({
  team1: {
    type: String,
    required: true,
  },
  team2: {
    type: String,
    required: true,
  },
  scoreTeam1: {
    type: Number,
    default: null,
  },
  scoreTeam2: {
    type: Number,
    default: null,
  },
  winner: {
    type: String,
    enum: ['team1', 'team2', null],
    default: null,
  },
});

const Knockout = mongoose.model('Knockout', knockoutMatchSchema);

export default Knockout;
