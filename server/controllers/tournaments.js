import Tournament from '../models/Tournament.js';
import User from '../models/User.js';
import Participant from '../models/Participant.js';
import Player from '../models/Player.js';
import TournamentParticipant from '../models/TournamentParticipant.js';
import Match from '../models/RoundRobin.js';
import Comment from '../models/Comment.js';
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
    res.json({
      message:
        'Поздравляем с успешным созданием турнира! 🎉 Пусть каждый матч наполняется азартом, а каждая победа приносит радость и гордость! 🏆',
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

export const updateTournament = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const { title, tournamentDesc, startDate, endDate, sportType, typeTournament } = req.body;

    // Найти турнир по ID и обновить его информацию
    const updatedTournament = await Tournament.findByIdAndUpdate(
      tournamentId,
      {
        title,
        tournamentDesc,
        startDate,
        endDate,
        sportType,
        typeTournament,
      },
      { new: true },
    );

    if (!updatedTournament) {
      return res.status(404).json({ success: false, message: 'Турнир не найден.' });
    }

    res.json({ success: true, tournament: updatedTournament });
  } catch (error) {
    console.error('Ошибка при обновлении турнира:', error);
    res.status(500).json({ success: false, message: 'Ошибка при обновлении турнира.' });
  }
};

export const getAllParticipants = async (req, res) => {
  try {
    const tournamentId = req.params.tournamentId;
    console.log(tournamentId);

    const participants = await TournamentParticipant.find({ tournament: tournamentId }); // Фильтрация участников по идентификатору турнира
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
    const username = user.lastName + ' ' + user.firstName;
    console.log('username', username);

    // Проверяем, зарегистрирован ли пользователь уже на этот турнир
    const existingParticipant = await TournamentParticipant.findOne({ user: userId, tournament: tournamentId });
    if (existingParticipant) {
      return res.json({ success: false, message: 'Вы уже зарегистрированы на этот турнир.' });
    }

    // Создаем новую запись участника с информацией о турнире
    const newParticipant = new TournamentParticipant({
      user: userId,
      username: username,
      tournament: tournamentId,
    });

    // Сохраняем участника в базе данных и обновляем список участников турнира
    await newParticipant.save();
    await Tournament.findByIdAndUpdate(
      tournamentId,
      {
        $push: { pendingParticipants: newParticipant },
      },
      { new: true },
    );

    return res.json({
      success: true,
      tournamentId,
      newParticipant,
      message: 'Отлично, вы успешно зарегистрировались на турнир! 🎉 Пусть каждая игра станет новым вызовом и шагом к победе! 🏅',
    });
  } catch (error) {
    console.error('Ошибка при регистрации участника:', error);
    return res.json({ success: false, message: 'Ошибка при регистрации участника.' });
  }
};

export const updateTournamentStatus = async (req, res) => {
  try {
    const { tournamentId } = req.params;

    // Находим турнир по его ID и обновляем его статус
    await Tournament.findByIdAndUpdate(tournamentId, { isStarted: true });
    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка при обновлении статуса турнира:', error);
    res.status(500).json({ success: false, message: 'Ошибка при обновлении статуса турнира.' });
  }
};

export const getTournamentStatus = async (req, res) => {
  try {
    const { tournamentId } = req.params;

    // Находим турнир по его ID
    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Турнир не найден.' });
    }

    // Возвращаем статус турнира
    res.json({ success: true, isStarted: tournament.isStarted });
  } catch (error) {
    console.error('Ошибка при чтении статуса турнира:', error);
    res.status(500).json({ success: false, message: 'Ошибка при чтении статуса турнира.' });
  }
};

export const deleteTournament = async (req, res) => {
  try {
    const { tournamentId } = req.params;

    // Найти и удалить все матчи, связанные с турниром
    await Match.deleteMany({ tournamentId: tournamentId });

    // Найти и удалить всех игроков, участвовавших в турнире
    const tournamentParticipants = await TournamentParticipant.find({ tournament: tournamentId });
    const participantIds = tournamentParticipants.map((participant) => participant.tournament);

    console.log('tournamentParticipants', tournamentParticipants);
    console.log('participantIds', participantIds);

    await Player.deleteMany({ tournamentId: { $in: participantIds } });
    await Participant.deleteMany({ tournament: { $in: participantIds } });
    // Удалить все записи участников, связанные с этим турниром
    await TournamentParticipant.deleteMany({ tournament: tournamentId });

    // Найти турнир по ID и удалить его
    const tournament = await Tournament.findByIdAndDelete(tournamentId);

    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Турнир не найден.' });
    }

    res.json({ success: true, message: 'Турнир успешно удалён.' });
  } catch (error) {
    console.error('Ошибка при удалении турнира:', error);
    res.status(500).json({ success: false, message: 'Ошибка при удалении турнира.' });
  }
};



export const addComment = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const { userId, text } = req.body;
		console.log('tournamentId', tournamentId);
		console.log('userId', userId);
		console.log('text', text);
		
		
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Пользователь не найден.' });
    }

    const newComment = new Comment({
      tournament: tournamentId,
      user: userId,
      username: `${user.firstName} ${user.lastName}`,
      text,
    });

    await newComment.save();

    res.json({ success: true, comment: newComment });
  } catch (error) {
    console.error('Ошибка при добавлении комментария:', error);
    res.status(500).json({ success: false, message: 'Ошибка при добавлении комментария.' });
  }
};

export const getComments = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const comments = await Comment.find({ tournament: tournamentId }).sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (error) {
    console.error('Ошибка при получении комментариев:', error);
    res.status(500).json({ success: false, message: 'Ошибка при получении комментариев.' });
  }
};


export const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.commentId, { $inc: { likes: 1 } }, { new: true });
    res.json({ comment });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при добавлении лайка' });
  }
};

export const dislikeComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.commentId, { $inc: { dislikes: 1 } }, { new: true });
    res.json({ comment });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при добавлении дизлайка' });
  }
};