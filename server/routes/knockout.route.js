// knockoutRoute.js
import express from 'express';
import { getMatches, createMatch, getParticipants, createParticipant } from '../controllers/knockout.controller.js';

const router = express.Router();

router.get('/matches', getMatches);
router.post('/matches', createMatch);

router.get('/participants', getParticipants);
router.post('/participants', createParticipant);

export default router;
