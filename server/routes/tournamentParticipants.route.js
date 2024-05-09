import express from 'express'
import TournamentParticipant from '../models/TournamentParticipant.js';
import Participant from '../models/Participant.js';

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

router.get('/accepted', async (req, res) => {
  try {
    const { tournamentId } = req.body; // Получаем tournamentId из параметров запроса
		// console.log(tournamentId,'yy');
    // const participantsd = await Participant.find({ tournament: tournamentId });
    const participantsd = await TournamentParticipant.find({ status: 'accepted' });
    res.json({ participantsd, message: 'GG' });
  } catch (error) {
    console.error('Ошибка при получении принятых участников:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});
// Отклонить участника турнира

router.put('/:id/reject', async (req, res) => {
  try {
    const { id } = req.params; // Получаем id участника из URL

    // Обновляем статус участника на "rejected"
    const rejectedParticipant = await TournamentParticipant.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });

    // Проверяем, найден ли участник и был ли его статус успешно обновлен
    if (!rejectedParticipant) {
      return res.status(404).json({ message: 'Участник не найден' });
    }

    // Удаляем участника из базы данных
    await TournamentParticipant.deleteOne({ _id: id });

    res.json({ message: 'Участник успешно отклонен и удален' });
  } catch (error) {
    console.error('Ошибка при отклонении и удалении участника:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});


export default router;