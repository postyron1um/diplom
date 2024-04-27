import mongoose from 'mongoose';

const tournamentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    tournamentDesc: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    sportType: {
      type: String,
      required: true,
    },
    typeTournament: {
      type: String,
      enum: ['Круговой', 'На вылет'],
      default: 'Круговой',
      required: true,
    },
    matches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',
      },
    ],
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Participant', // Ссылка на модель Participant
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Tournament = mongoose.model('Tournament', tournamentSchema);

export default Tournament;
