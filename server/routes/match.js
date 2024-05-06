// match.route.js
import { Router } from 'express';
import { createMatch, getAllMatches, updateMatch, updateMatchResult, updatedMatchResultTimur } from '../controllers/match.js';
import { checkAuth } from '../utils/checkAuth.js';

// import { updateTournamentStatus } from '../../client/src/redux/features/matchSlice/matchSlice.js';


const router = new Router();

// http://localhost:3007/api/tournaments/:tournamentId/matches

// Создание нового матча
router.post('/', checkAuth, createMatch);

// Получение всех матчей
router.get('/', getAllMatches);

// Обновление матча
// router.put('/:matchId/result', updateMatchResult);
router.put('/:matchId/result', updatedMatchResultTimur);
router.put('/:matchId', updateMatch);


export default router;
