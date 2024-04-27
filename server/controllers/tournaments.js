import Tournament from '../models/Tournament.js';
import User from '../models/User.js';
import Participant from '../models/Participant.js';
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
    // Получите информацию о пользователе (включая его имя) из базы данных
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: 'Пользователь не найден.' });
    }
    const username = user.username; 
    const existingParticipant = await Participant.findOne({ user: userId, tournament: tournamentId });
    if (existingParticipant) {
      return res.json({ success: false, message: 'Вы уже зарегистрированы на этот турнир.' });
    }
    // Создайте новую запись участника с именем пользователя
    const newParticipant = new Participant({
      user: userId,
      username: username, // Сохраните имя пользователя
      tournament: tournamentId,
    });
    // Сохраните участника в базе данных
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
