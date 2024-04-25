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
    console.log(newTournament);
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

export const registerParticipant = async (req, res) => {
  try {
    const userId = req.body.userId;
    const tournamentId = req.params.tournamentId;
    // Проверяем, не зарегистрирован ли пользователь уже для этого турнира
    const existingParticipant = await Participant.findOne({ user: userId, tournament: tournamentId });

    const user = await User.findById(userId);
    // console.log(user);

    if (existingParticipant) {
      return res.json({ success: false, message: 'Вы уже зарегистрированы на этот турнир.' });
    }

    // Создаем новую запись участника
    const newParticipant = new Participant({
      user: userId,
      tournament: tournamentId,
    });

    // Сохраняем участника в базе данных
    await newParticipant.save();
    await Tournament.findByIdAndUpdate(
      tournamentId,
      {
        $push: { participants: newParticipant.user }, // Добавляем целиком объект нового участника
      },
      { new: true },
    );
    return res.json({ success: true, newParticipant,message: 'Вы успешно зарегистрированы для участия в турнире.' });
  } catch (error) {
    // console.error('Ошибка при регистрации участника:', error);
    return res.json({ success: false, message: 'Ошибка при регистрации участника.' });
  }
};
