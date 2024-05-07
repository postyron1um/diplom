import KnockoutMatch from '../models/KnockoutMatch.js'; 
import Participant from '../models/Participant.js';

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

// Создать нового участника
const createParticipant = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const { user, username } = req.body;
    // Создаем нового участника с переданными данными
    const participant = await Participant.create({ tournament: tournamentId, user, username });
    res.status(201).json(participant);
  } catch (error) {
    console.error('Ошибка при создании участника:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};


export { getMatches, createMatch, getParticipants, createParticipant };