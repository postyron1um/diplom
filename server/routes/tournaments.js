import { Router } from 'express';
import { register, login, getMe, getUsers } from '../controllers/auth.js';
import { checkAuth } from '../utils/checkAuth.js';
import { check } from 'express-validator';
import authMiddleware from '../utils/authMiddleware.js';
import roleMiddleware from '../utils/roleMiddleware.js';
import { createTournament, getAll, getAllParticipants, registerParticipant } from '../controllers/tournaments.js';
import Tournament from '../models/Tournament.js';
// import { registerParticipant } from '../controllers/registerParticipant.js';


const router = new Router();
// http://localhost:3002/api/tournaments
// Create
router.post('/', createTournament);

// router.post('/',roleMiddleware(['ADMIN']), createTournament);
// тут было так  -   позже исправить ошибку

// Get All tournaments
router.get('/', getAll);

router.post('/:tournamentId/register',checkAuth, registerParticipant);

router.get('/:tournamentId',checkAuth, getAllParticipants);

export default router;
