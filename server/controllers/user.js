

import User from '../models/User.js';

export const getUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('userId', userId);

    // Здесь выполняется запрос к базе данных для получения данных о пользователе по его ID
    const user = await User.findById(userId);
    console.log('user', user);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    // Отправляем данные о пользователе в качестве ответа
    res.json(user);
  } catch (error) {
    console.error('Ошибка при получении данных о пользователе:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// export { getUser };