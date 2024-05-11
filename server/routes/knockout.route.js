import express from 'express';
import {
  getMatches,
  createMatch,
  updateMatch,
  getParticipants,
  acceptParticipantKnock,
  registerParticipantKnock,
  createMatchFromObject,
  acceptedParticipants,
  championTournament,
} from '../controllers/knockout.controller.js';

const router = express.Router();

// /api/tournaments/:tournamentId/knockout

router.get('/:tournamentId/knockout/matches', getMatches);
router.post('/:tournamentId/knockout/matches', createMatch);
router.post('/:tournamentId/knockout/matches/next', createMatchFromObject);
router.put('/:tournamentId/knockout/matches/:matchId', updateMatch);
router.put('/:tournamentId/champion',championTournament);

router.get('/:tournamentId/knockout/participants/accepted', acceptedParticipants);
router.put('/:tournamentId/knockout/participants/:participantId/accept', acceptParticipantKnock);


// router.get('/participants', getParticipants);
router.post('/:tournamentId/knockout/participants', registerParticipantKnock);

export default router;
