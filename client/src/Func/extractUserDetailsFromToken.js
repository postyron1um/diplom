const extractUserDetailsFromToken = (token, info) => {
  try {
    // декодируем токен, разделяя его по точке и декодируя вторую часть, содержащую полезные данные
    const payload = JSON.parse(atob(token.split('.')[1]));

    if (info === 'username') {
      return payload.username;
    } else if (info === 'roles') {
      return payload.roles;
    } else {
      throw new Error('Неподдерживаемый тип информации');
    }
  } catch (error) {
    console.error('Ошибка при извлечении данных пользователя из токена:', error);
    return null;
  }
};

export default extractUserDetailsFromToken;