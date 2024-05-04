import Tournament from '../models/Tournament.js';
import User from '../models/User.js';
import Participant from '../models/Participant.js';
import Player from '../models/Player.js';
// Create

export const createTournament = async (req, res) => {
  try {
    const { title, tournamentDesc, startDate, endDate, sportType, typeTournament } = req.body;
    // const user = await User.findById(req.userId);
    const newTournament = new Tournament({
      title,
      sportType,
      typeTournament,
      tournamentDesc,
      startDate,
      endDate,
    });
    await newTournament.save();
    await User.findByIdAndUpdate(req.userId, {
      $push: { participatedTournaments: newTournament },
    });
  } catch (error) {
    res.json({ message: 'Что-то пошло не так' });
  }
};

export const getAll = async (req, res) => {
  try {
    const tournaments = await Tournament.find().sort('-createdAt');
    // console.log(tournaments);
    if (!tournaments) {
      return res.json({ message: 'Турниров нет' });
    }
    res.json({ tournaments });
  } catch (error) {
    res.json({ message: 'Упс...' });
  }
};
export const getAllParticipants = async (req, res) => {
  try {
    const tournamentId = req.params.tournamentId;
		console.log(tournamentId);
		
    const participants = await Participant.find({ tournament: tournamentId }); // Фильтрация участников по идентификатору турнира
    if (!participants) {
      return res.json({ message: 'Участников нет' });
    }
    res.json({ participants });
  } catch (error) {
    console.error('Ошибка при получении участников турнира:', error);
    res.json({ message: 'Упс...' });
  }
};

export const registerParticipant = async (req, res) => {
  try {
    const userId = req.body.userId;
    const tournamentId = req.params.tournamentId;

    // Получаем информацию о пользователе (включая его имя) из базы данных
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: 'Пользователь не найден.' });
    }
    const username = user.username;

    // Проверяем, зарегистрирован ли пользователь уже на этот турнир
    const existingParticipant = await Participant.findOne({ user: userId, tournament: tournamentId });
    if (existingParticipant) {
      return res.json({ success: false, message: 'Вы уже зарегистрированы на этот турнир.' });
    }

    // Создаем новую запись участника с информацией о турнире
    const newParticipant = new Participant({
      user: userId,
      username: username,
      tournament: tournamentId,
    });

    // Создаем данные игрока для нового участника
    const playerData = {
      participant: newParticipant._id,
      username: username,
      tournamentId: tournamentId, // Добавляем tournamentId
      matches: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      goalsFor: 0,
      goalsAgainst:0,
    };

    // // Создаем нового игрока и сохраняем его
    // const newPlayer = await Player.create(playerData);

    // Сохраняем участника в базе данных и обновляем список участников турнира
    await newParticipant.save();
    await Tournament.findByIdAndUpdate(
      tournamentId,
      {
        $push: { participants: newParticipant },
      },
      { new: true },
    );

    return res.json({ success: true, newParticipant, message: 'Вы успешно зарегистрированы для участия в турнире.' });
  } catch (error) {
    console.error('Ошибка при регистрации участника:', error);
    return res.json({ success: false, message: 'Ошибка при регистрации участника.' });
  }
};

export const updateTournamentStatus = async (req, res) => {
  try {
    const { tournamentId } = req.body;
    console.log('туруру');

    // Находим турнир по его ID и обновляем его статус
    await Tournament.findByIdAndUpdate(tournamentId, { isStarted: true });
    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка при обновлении статуса турнира:', error);
    res.status(500).json({ success: false, message: 'Ошибка при обновлении статуса турнира.' });
  }
};
