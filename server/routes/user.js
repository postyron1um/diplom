import { getUser } from '../controllers/user.js';
// import User from '../models/User.js';
import { Router } from 'express';

const router = new Router();

router.get('/:userId', getUser);

export default router;
