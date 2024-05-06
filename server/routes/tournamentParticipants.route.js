import express from 'express'
import TournamentParticipant from '../models/TournamentParticipant.js';

const router = express.Router();
//http://localhost:3007/api/tournaments/:tournamentId/participants


// Получить всех участников турнира
router.get('/', async (req, res) => {
  try {
    const { tournamentId } = req.body;
    console.log('tournamentId', tournamentId);
    
    // Извлекаем только участников с определенными статусами
    const participants = await TournamentParticipant.find({
      tournament: tournamentId,

    })

    res.json({ participants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.put('/:id/accept', async (req, res) => {
  try {
    const { id } = req.params; // Получаем id участника из URL
    const participant = await TournamentParticipant.findByIdAndUpdate(id, { status: 'accepted' }, { new: true });
    res.json(participant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Отклонить участника турнира
router.put('/:id/reject', async (req, res) => {
  try {
    const { id } = req.params; // Получаем id участника из URL
    const participant = await TournamentParticipant.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
    res.json(participant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});
export default router;