import mongoose from 'mongoose';

const knockoutMatchSchema = new mongoose.Schema({
  tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
  team1: { type: mongoose.Schema.Types.ObjectId, ref: 'KnockoutParticipant', required: true },
  team2: { type: mongoose.Schema.Types.ObjectId, ref: 'KnockoutParticipant', required: true },
  scoreTeam1: { type: Number, default: 0 },
  scoreTeam2: { type: Number, default: 0 },
  winner: { type: String, default: null },
  // Другие поля по вашему усмотрению
});

const KnockoutMatch = mongoose.model('KnockoutMatch', knockoutMatchSchema);

export default KnockoutMatch;
