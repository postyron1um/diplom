import User from '../models/User.js';
import Role from '../models/Role.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
// Register user
export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ message: 'Ошибка при регистрации', errors });
    }
    const { username, password } = req.body;

    const isUsed = await User.findOne({ username });

    if (isUsed) {
      return res.json({
        message: 'Данный username уже занят',
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const userRole = await Role.findOne({ value: 'USER' });

    const newUser = new User({
      username,
      password: hash,
      roles: [userRole.value],
    });
    const token = jwt.sign(
      {
        id: newUser._id,
        role: Role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' },
    );
    await newUser.save();

    res.json({
      newUser,
      token,
      message: 'Регистрация прошла успешно.',
    });
  } catch (error) {
    res.json({ message: 'Ошибка при создание пользователя', error });
  }
};
// Login user
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ message: 'Такого пользователя нет.' });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.json({ message: 'Неверный пароль' });
    }

    const token = jwt.sign(
      {
        id: user._id,
				username:user.username,
        roles: user.roles,
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' },
    );

    res.json({
      token,
      user,
      message: 'Вы вошли в систему',
    });
  } catch (error) {
    res.json({ message: 'Ошибка при авторизации', error });
  }
};

// Список пользователей
export const getUsers = async (req, res) => {
  try {
		const users = await User.find()
    res.json(users);
  } catch (error) {
		console.log(error);
		
	}
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.json({ message: 'Такого пользователя нет.' });
    }
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' },
    );
    res.json({
      user,
      token,
    });
  } catch (error) {
    res.json({ message: 'Нет доступа' });
  }
};
