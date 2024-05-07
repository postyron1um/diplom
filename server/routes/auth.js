import { Router } from 'express';
import { register, login, getMe, getUsers } from '../controllers/auth.js';
import { checkAuth } from '../utils/checkAuth.js';
import { check } from 'express-validator';
import authMiddleware from '../utils/authMiddleware.js';
import roleMiddleware from '../utils/roleMiddleware.js';
const router = new Router();

// Register
// http://localhost:3002/api/auth/register
router.post(
  '/register',
  [
    check('username', 'Имя пользователя не может быть пустым').trim().notEmpty(),
    check('password', 'Пароль должен быть больше 8 символов').trim().isLength({ min: 4, max: 20 }),
  ],
  register,
);

// http://localhost:3002/api/auth/login
router.post('/login', login);

router.get('/users', roleMiddleware(['ADMIN']), getUsers);

// http://localhost:3002/api/auth/me
router.get('/me', checkAuth, getMe);

export default router;
