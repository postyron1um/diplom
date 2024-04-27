import Match from '../models/Knockout.js';
import Tournament from '../models/Tournament.js';

// Создание нового матча
export const createMatch = async (req, res) => {
  try {
    const { tournamentId, round, team1, team2, score1, score2, date } = req.body;
    const newMatch = new Match({ tournamentId, round, team1, team2, score1, score2, date });
    await newMatch.save();

    // Обновление списка матчей турнира в базе данных tournaments
    try {
      // Находим турнир по ID
      const tournament = await Tournament.findById(tournamentId);
      // Добавляем ID нового матча в массив матчей турнира
      tournament.matches.push(newMatch._id);
      // Сохраняем обновленные данные о турнире
      await tournament.save();
    } catch (error) {
      console.error('Ошибка при обновлении матчей турнира:', error);
      throw error;
    }

    res.status(201).json({ success: true, match: newMatch });
  } catch (error) {
    console.error('Ошибка при создании матча:', error);
    res.status(500).json({ success: false, message: 'Ошибка при создании матча.' });
  }
};

// Получение всех матчей
export const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find();
    res.json({ success: true, matches });
  } catch (error) {
    console.error('Ошибка при получении всех матчей:', error);
    res.status(500).json({ success: false, message: 'Ошибка при получении всех матчей.' });
  }
};

// Обновление матча
export const updateMatch = async (req, res) => {
  try {
    const { matchId } = req.body;
    const { score1, score2 } = req.body;
    // Находим матч по его ID и обновляем его данные
    const updatedMatch = await Match.findByIdAndUpdate(matchId, { score1, score2 }, { new: true });
    res.json({ success: true, match: updatedMatch });
  } catch (error) {
    console.error('Ошибка при обновлении матча:', error);
    res.status(500).json({ success: false, message: 'Ошибка при обновлении матча.' });
  }
};