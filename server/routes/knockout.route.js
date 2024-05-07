import express from 'express';
import { getMatches, createMatch, getParticipants, registerParticipantKnock, acceptParticipantKnock, rejectParticipantKnock } from '../controllers/knockout.controller.js';

const router = express.Router();

router.get('/matches', getMatches);
router.post('/matches', createMatch);

router.get('/participants', getParticipants);
router.post('/participants', registerParticipantKnock);

// Маршруты для принятия и отклонения участников
router.put('/participants/:participantId/accept', acceptParticipantKnock);
router.put('/participants/:participantId/reject', rejectParticipantKnock);

export default router;