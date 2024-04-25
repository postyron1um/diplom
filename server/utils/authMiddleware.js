import jwt from 'jsonwebtoken';

export default function (req, res, next) {
  if (req.method === 'OPTIONS') {
    next();
  }

  try {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if (!token) {
      return res.json({ message: 'Пользователь не авторизован' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next()
  } catch (error) {
    console.log(error);
    return res.json({ message: 'Пользователь не авторизован' });
  }
}
