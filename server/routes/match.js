// match.route.js
import { Router } from 'express';
import { createMatch, getAllMatches, updateMatch } from '../controllers/match.js';
import { checkAuth } from '../utils/checkAuth.js';

const router = new Router();

// Создание нового матча
router.post('/', checkAuth, createMatch);

// Получение всех матчей
router.get('/', getAllMatches);

// Обновление матча
router.put('/:matchId', checkAuth, updateMatch);
// router.put('/:matchId', updateMatch);

export default router;
