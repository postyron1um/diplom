import { Router } from 'express';
import { checkAuth } from '../utils/checkAuth.js';
import { check } from 'express-validator';
import authMiddleware from '../utils/authMiddleware.js';
import roleMiddleware from '../utils/roleMiddleware.js';
import { addComment, createTournament, deleteTournament, dislikeComment, getAll, getAllParticipants, getComments, getTournamentStatus, likeComment, registerParticipant, updateTournament } from '../controllers/tournaments.js';
import Tournament from '../models/Tournament.js';
import { updateTournamentStatus } from '../controllers/tournaments.js';
import Player from '../models/Player.js';
// import { updateTournamentStatus } from '../../client/src/redux/features/matchSlice/matchSlice.js';
// import { registerParticipant } from '../controllers/registerParticipant.js';


const router = new Router();
// http://localhost:3007/api/tournaments
// Create
router.post('/', roleMiddleware(['ADMIN']),createTournament);

// router.post('/',roleMiddleware(['ADMIN']), createTournament);
// тут было так  -   позже исправить ошибку

// Get All tournaments
router.get('/', getAll);

// Получаем конкретный турнир
router.get('/:tournamentId',async(req,res) => {
  const { tournamentId } = req.params;
  const tournament = await Tournament.find({_id: tournamentId})
  res.json({tournament})
})

router.post('/:tournamentId/register',checkAuth, registerParticipant);

router.get('/:tournamentId/participants', getAllParticipants);
router.put('/:tournamentId/update', updateTournament);

router.put('/:tournamentId/status', updateTournamentStatus); 
router.get('/:tournamentId/status', getTournamentStatus);

router.get('/:tournamentId/players', async (req, res) => {
  try {
    const { tournamentId } = req.params;
    // Находим всех игроков турнира по его ID`
    const players = await Player.find({ tournamentId });

    // Сортировка игроков по количеству очков (победы * 3 + ничьи)
    players.sort((a, b) => {
      const pointsA = a.wins * 3 + a.draws;
      const pointsB = b.wins * 3 + b.draws;
      // Сначала сравниваем количество очков
      if (pointsA !== pointsB) {
        return pointsB - pointsA; // Сортируем по убыванию количества очков
      } else {
        // Если количество очков одинаковое, сравниваем другие критерии, например, разницу забитых и пропущенных голов
        const goalDifferenceA = a.goalsFor - a.goalsAgainst;
        const goalDifferenceB = b.goalsFor - b.goalsAgainst;
        return goalDifferenceB - goalDifferenceA; // Сортируем по убыванию разницы забитых и пропущенных голов
      }
    });

    res.json({ success: true, players });
  } catch (error) {
    console.error('Ошибка при получении данных об игроках турнира:', error);
    res.status(500).json({ success: false, message: 'Ошибка при получении данных об игроках турнира.' });
  }
});
router.post('/:tournamentId/comments', addComment); // Add comment
router.get('/:tournamentId/comments', getComments); // Get comments
router.post('/:tournamentId/comments/:commentId/like', likeComment);
router.post('/:tournamentId/comments/:commentId/dislike', dislikeComment);

router.delete('/:tournamentId', roleMiddleware(['ADMIN']), deleteTournament);

export default router;
