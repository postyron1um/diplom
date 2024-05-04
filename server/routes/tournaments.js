import { Router } from 'express';
import { register, login, getMe, getUsers } from '../controllers/auth.js';
import { checkAuth } from '../utils/checkAuth.js';
import { check } from 'express-validator';
import authMiddleware from '../utils/authMiddleware.js';
import roleMiddleware from '../utils/roleMiddleware.js';
import { createTournament, getAll, getAllParticipants, registerParticipant } from '../controllers/tournaments.js';
import Tournament from '../models/Tournament.js';
import { updateTournamentStatus } from '../controllers/tournaments.js';
import Player from '../models/Player.js';
// import { updateTournamentStatus } from '../../client/src/redux/features/matchSlice/matchSlice.js';
// import { registerParticipant } from '../controllers/registerParticipant.js';


const router = new Router();
// http://localhost:3007/api/tournaments
// Create
router.post('/', createTournament);

// router.post('/',roleMiddleware(['ADMIN']), createTournament);
// тут было так  -   позже исправить ошибку

// Get All tournaments
router.get('/', getAll);

router.post('/:tournamentId/register',checkAuth, registerParticipant);

// router.get('/:tournamentId', getAllParticipants);
router.get('/:tournamentId/participants', getAllParticipants);


router.put('/:tournamentId/status', updateTournamentStatus); 

router.get('/:tournamentId/players', async (req, res) => {
  try {
    const { tournamentId } = req.params;
    // Находим всех игроков турнира по его ID
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









export default router;
