import KnockoutMatch from '../models/KnockoutMatch.js';
import Participant from '../models/Participant.js';
import KnockoutParticipant from '../models/KnockoutParticipant.js';
import User from '../models/User.js';
import Tournament from '../models/Tournament.js';
import TournamentParticipant from '../models/TournamentParticipant.js';

// Создать новый матч
const createMatch = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const { initialRoundMatches } = req.body;
    // console.log('initialRoundMatches', initialRoundMatches);

    // Проходим по каждому раунду
    for (let i = 0; i < initialRoundMatches.length; i++) {
      const roundMatches = initialRoundMatches[i];
      // Проходим по каждому матчу в текущем раунде
      for (let j = 0; j < roundMatches.length; j++) {
        const match = roundMatches[j];
        console.log('match', match);

        // Находим объекты участников по именам команд
        const participant1 = await KnockoutParticipant.findOne({ username: match.team1.username });
        const participant2 = await KnockoutParticipant.findOne({ username: match.team2.username });
        // console.log('participant1,', participant1);
        // console.log('participant2,', participant2);

        // Проверяем, что оба участника найдены
        if (!participant1 || !participant2) {
          return res.status(404).json({ message: 'Не удалось найти участников с указанными именами команд.' });
        }

        // Создаем новый матч с ObjectId участников вместо их имен
        const matchKnock = await KnockoutMatch.create({
          tournament: tournamentId,
          round: match.round,
          team1: participant1.username,
          team2: participant2.username,
        });
        await matchKnock.save();

        await Tournament.findByIdAndUpdate(tournamentId, { $push: { knockMatches: matchKnock._id } }, { new: true });
      }
    }
    await Tournament.findByIdAndUpdate(tournamentId, { isStarted: true });
    res.status(201).json(initialRoundMatches);
  } catch (error) {
    console.error('Ошибка при создании матча:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// // Получить все матчи для турнира на вылет
const getMatches = async (req, res) => {
  try {
    // Получаем id турнира из параметров запроса
    const { tournamentId } = req.params;
    // console.log('getMatches', req.params);

    // Находим все матчи для данного турнира
    const matches = await KnockoutMatch.find({ tournament: tournamentId });

    // Группируем матчи по раундам
    const roundMatches = matches.reduce((acc, match) => {
      if (!acc[match.round]) {
        acc[match.round] = [];
      }
      acc[match.round].push(match);
      return acc;
    }, {});

    // Преобразуем объект с матчами каждого раунда в массив
    const roundMatchesArray = Object.values(roundMatches);

    res.json({ roundMatches: roundMatchesArray, message: 'Буяка буяка' });
  } catch (error) {
    console.error('Ошибка при получении матчей:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Создание следующих раундов
const createMatchFromObject = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const { initialRoundMatches } = req.body;
    console.log('initialRoundMatchesaaa', initialRoundMatches);

    // Проходим по каждому раунду
    for (let i = 0; i < initialRoundMatches.length; i++) {
      const roundMatch = initialRoundMatches[i];
      console.log('roundMatch', roundMatch);

      // Создаем новый матч
      const matchKnock = await KnockoutMatch.create({
        tournament: tournamentId,
        round: roundMatch.round + 1,
        team1: roundMatch.team1,
        team2: roundMatch.team2,
      });
      await matchKnock.save();
      await Tournament.findByIdAndUpdate(tournamentId, { $push: { knockMatches: matchKnock._id } }, { new: true });
    }

    res.status(201).json(initialRoundMatches);
  } catch (error) {
    console.error('Ошибка при создании матча:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Обновлние результатов матча
const updateMatch = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { updatedMatch } = req.body;
    console.log('updatedMatch', updatedMatch);

    // Найдите матч по его ID
    const match = await KnockoutMatch.findById(matchId);
    console.log('match', match);

    if (!match) {
      return res.status(404).json({ message: 'Матч не найден' });
    }

    // Обновите информацию о матче
    match.scoreTeam1 = updatedMatch.scoreTeam1;
    match.scoreTeam2 = updatedMatch.scoreTeam2;
    match.winner = updatedMatch.winner;

    // Сохраните обновленный матч
    await match.save();

    res.status(200).json({ message: 'Информация о матче успешно обновлена', match });
  } catch (error) {
    console.error('Ошибка при обновлении информации о матче:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

const registerParticipantKnock = async (req, res) => {
  try {
    const userId = req.body.userId;
    console.log(' req.body', req.body);

    const tournamentId = req.body.tournamentId;
    console.log('userId', userId);
    console.log('tournamentId', tournamentId);

    // Получаем информацию о пользователе (включая его имя) из базы данных
    const user = await User.findById(userId);
    console.log('user', user);

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
    const newParticipant = new TournamentParticipant({
      user: userId,
      username: username,
      tournament: tournamentId,
    });

    // const newParticipantKnock = new KnockoutParticipant({
    //   user: userId,
    //   username: username,
    //   tournament: tournamentId,
    // });

    // Сохраняем участника в базе данных и обновляем список участников турнира
    // await newParticipantKnock.save();
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

const acceptParticipantKnock = async (req, res) => {
  try {
    const { participantId } = req.params; // Получаем id участника из URL
    const id = participantId;

    const participant = await TournamentParticipant.findByIdAndUpdate(id, { status: 'accepted' }, { new: true });
    const newKnockoutParticipant = await KnockoutParticipant.create({
      user: participant.user, // Передаем id пользователя
      username: participant.username, // Передаем имя пользователя
      tournament: participant.tournament, // Передаем id турнира
    });
    await newKnockoutParticipant.save();
    res.json(participant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

const rejectParticipantKnock = async (req, res) => {
  try {
    const participantId = req.params.participantId;
    // Проверяем, что участник существует
    const participant = await KnockoutParticipant.findById(participantId);
    if (!participant) {
      return res.status(404).json({ success: false, message: 'Участник не найден' });
    }

    // Если статус участника уже "rejected", то удаляем его из базы данных
    if (participant.status === 'rejected') {
      await KnockoutParticipant.findByIdAndDelete(participantId);
      return res.json({ success: true, message: 'Участник удален из базы данных' });
    }

    // Иначе обновляем статус участника на "rejected" в базе данных
    await KnockoutParticipant.findByIdAndUpdate(participantId, { status: 'rejected' });
    res.json({ success: true, message: 'Участник отклонен от турнира' });
  } catch (error) {
    console.error('Ошибка при отклонении участника от турнира:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
};

const acceptedParticipants = async (req, res) => {
  try {
    const tournamentId = req.params.tournamentId; // Получаем tournamentId из параметров запроса
    // console.log(tournamentId, '888888888');
    // const participantsd = await Participant.find({ tournament: tournamentId });
    const participantsd = await TournamentParticipant.find({ status: 'accepted', tournament: tournamentId });

    res.json({ participantsd, message: 'ff' });
  } catch (error) {
    console.error('Ошибка при получении принятых участников:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

const championTournament = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const { champion } = req.body;
    console.log('champion', champion);

    const updatedTournament = await Tournament.findByIdAndUpdate(tournamentId, { champion }, { new: true });
    res.json(updatedTournament);
  } catch (error) {
    console.error('Error updating champion:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export {
  registerParticipantKnock,
  updateMatch,
  getMatches,
  createMatch,
  getParticipants,
  rejectParticipantKnock,
  createMatchFromObject,
  acceptParticipantKnock,
  acceptedParticipants,
  championTournament,
};
