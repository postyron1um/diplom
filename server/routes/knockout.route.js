import express from 'express';
import { getMatches, createMatch, getParticipants, registerParticipantKnock, rejectParticipantKnock } from '../controllers/knockout.controller.js';
import TournamentParticipant from '../models/TournamentParticipant.js';
import KnockoutParticipant from '../models/KnockoutParticipant.js';

const router = express.Router();

// /api/tournaments/:tournamentId/knockout

router.get('/:tournamentId/knockout/matches', getMatches);
router.post('/:tournamentId/knockout/matches', createMatch);

router.get('/participants', getParticipants);
router.post('/:tournamentId/knockout/participants', registerParticipantKnock);

// Маршруты для принятия и отклонения участников
router.put('/:tournamentId/knockout/participants/:participantId/accept', async (req, res) => {
  try {
    const { participantId } = req.params; // Получаем id участника из URL
    const id = participantId;
	
		
    const participant = await TournamentParticipant.findByIdAndUpdate(id, { status: 'accepted' }, { new: true });
		const newKnockoutParticipant = await KnockoutParticipant.create({
      user: participant.user, // Передаем id пользователя
      username: participant.username, // Передаем имя пользователя
      tournament: participant.tournament, // Передаем id турнира
    });
		await newKnockoutParticipant();
    res.json(participant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/:tournamentId/knockout/participants/accepted', async (req, res) => {
  try {
    const tournamentId = req.params.tournamentId; // Получаем tournamentId из параметров запроса
    // console.log(tournamentId, '888888888');
    // const participantsd = await Participant.find({ tournament: tournamentId });
    const participantsd = await TournamentParticipant.find({ status: 'accepted', tournament: tournamentId });


    res.json({ participantsd, message: 'ff' });
  } catch (error) {
    console.error('Ошибка при получении принятых участников:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});



router.put('/participants/:participantId/reject', rejectParticipantKnock);



export default router;