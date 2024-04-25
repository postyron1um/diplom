import jwt from 'jsonwebtoken';

export default function (roles) {
  return function (req, res, next) {
    if (req.method === 'OPTIONS') {
      next();
    }

    try {
      const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
      // const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.json({ message: 'Пользователdsь не авторизован' });
      }
      const { roles: userRoles } = jwt.verify(token, process.env.JWT_SECRET);
      let hasRole = false;
			

      userRoles.forEach((role) => {
        if (roles.includes(role)) {
          hasRole = true;
        }
      });

      if (!hasRole) {
        return res.json({ message: 'У вас нет доступа' });
      }
      next();
    } catch (error) {
      console.log(error);
      return res.json({ message: 'What' });
    }
  };
}
