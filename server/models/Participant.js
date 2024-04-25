import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // username: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true,
  // },
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament', // Ссылка на модель Tournament
    required: true,
  },
});

const Participant = mongoose.model('Participant', participantSchema);

export default Participant;
