import KnockoutMatch from '../models/KnockoutMatch.js'; 
import Participant from '../models/Participant.js';
import KnockoutParticipant from '../models/KnockoutParticipant.js';
import User from '../models/User.js';
import Tournament from '../models/Tournament.js';

// Получить все матчи для турнира на вылет
const getMatches = async (req, res) => {
  try {
    // Получаем id турнира из параметров запроса
    const { tournamentId } = req.params;
    // Находим все матчи для данного турнира
    const matches = await KnockoutMatch.find({ tournament: tournamentId });
    res.json(matches);
  } catch (error) {
    console.error('Ошибка при получении матчей:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};


// Создать новый матч
const createMatch = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const { team1, team2 } = req.body;
    // Создаем новый матч с переданными данными
    const match = await KnockoutMatch.create({ tournament: tournamentId, team1, team2 });
    res.status(201).json(match);
  } catch (error) {
    console.error('Ошибка при создании матча:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};


// Получить всех участников для турнира на вылет
const getParticipants = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    // Находим всех участников для данного турнира
    const participants = await Participant.find({ tournament: tournamentId });
    res.json(participants);
  } catch (error) {
    console.error('Ошибка при получении участников:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};


 const registerParticipantKnock = async (req, res) => {
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
    const existingParticipant = await TournamentParticipant.findOne({ user: userId, tournament: tournamentId });
    if (existingParticipant) {
      return res.json({ success: false, message: 'Вы уже зарегистрированы на этот турнир.' });
    }

    // Создаем новую запись участника с информацией о турнире
    const newParticipant = new KnockoutParticipant({
      user: userId,
      username: username,
      tournament: tournamentId,
    })

    // Сохраняем участника в базе данных и обновляем список участников турнира
    await newParticipant.save();
    await Tournament.findByIdAndUpdate(
      tournamentId,
      {
        $push: { pendingParticipants: newParticipant },
      },
      { new: true },
    );

    return res.json({ success: true,tournamentId, newParticipant, message: 'Отлично, вы успешно зарегистрировались на турнир! 🎉 Пусть каждая игра станет новым вызовом и шагом к победе! 🏅' });
  } catch (error) {
    console.error('Ошибка при регистрации участника:', error);
    return res.json({ success: false, message: 'Ошибка при регистрации участника.' });
  }
};

const acceptParticipantKnock = async (req, res) => {
  try {
    const participantId = req.params.participantId;
    // Обновляем статус участника на "accepted" в базе данных
    await KnockoutParticipant.findByIdAndUpdate(participantId, { status: 'accepted' });
    res.json({ success: true, message: 'Участник принят на турнир' });
  } catch (error) {
    console.error('Ошибка при принятии участника на турнир:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
};
const rejectParticipantKnock = async (req, res) => {
  try {
    const participantId = req.params.participantId;
    // Обновляем статус участника на "rejected" в базе данных
    await KnockoutParticipant.findByIdAndUpdate(participantId, { status: 'rejected' });
    res.json({ success: true, message: 'Участник отклонен от турнира' });
  } catch (error) {
    console.error('Ошибка при отклонении участника от турнира:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
};


export {registerParticipantKnock, getMatches, createMatch, getParticipants, acceptParticipantKnock,rejectParticipantKnock };