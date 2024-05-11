import React, { useState, useEffect } from 'react';
import axios from './../../../utils/axios'
import { useLoaderData } from 'react-router-dom';

const KnockoutTournament = () => {
  const [tournament, setTournament] = useState(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [participants, setParticipants] = useState([]);
  let currentTournament = useLoaderData();
  const tournamentId = currentTournament._id;
  console.log(tournamentId);
  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const response = await axios.get(`/tournaments/${tournamentId}`);
        setTournament(response.data);
        setParticipants(response.data.participants); // Получаем участников турнира
      } catch (error) {
        console.error('Ошибка:', error.message);
      }
    };

    fetchTournament();
  }, [tournamentId]);

  const createFirstRoundMatches = async () => {
    try {
      const response = await axios.post(`http://localhost:3007/api/tournaments/${tournamentId}/matches/create`, {
        participants,
      });
      // Обновляем текущий раунд и матчи
      setCurrentRound(1);
      setTournament((prevTournament) => ({
        ...prevTournament,
        matches: response.data,
      }));
    } catch (error) {
      console.error('Ошибка при создании матчей:', error.message);
    }
  };

  const advanceToNextRound = async () => {
    try {
      // Собираем результаты текущего раунда для отправки на сервер
      const currentRoundResults = tournament.matches.map((match) => ({
        matchId: match._id,
        scoreTeam1: Math.floor(Math.random() * 6), // Пример: случайный счет для команды 1
        scoreTeam2: Math.floor(Math.random() * 6), // Пример: случайный счет для команды 2
        winner: Math.random() < 0.5 ? match.team1 : match.team2, // Пример: выбор победителя случайным образом
      }));

      const response = await axios.post(`http://localhost:3007/api/tournaments/${tournamentId}/matches/advance`, {
        currentRoundResults,
      });

      // Обновляем текущий раунд и матчи
      setCurrentRound((prevRound) => prevRound + 1);
      setTournament((prevTournament) => ({
        ...prevTournament,
        matches: response.data,
      }));
    } catch (error) {
      console.error('Ошибка при переходе к следующему раунду:', error.message);
    }
  };

  return (
    <div>
      {tournament && (
        <div>
          <h1>{tournament.title}</h1>
          <p>Текущий раунд: {currentRound}</p>
          {currentRound === 1 && <button onClick={createFirstRoundMatches}>Начать турнир</button>}
          {currentRound > 1 && <button onClick={advanceToNextRound}>Следующий раунд</button>}
          {/* Отображение матчей и результатов */}
          <div>
            <h2>Матчи раунда {currentRound}</h2>
            {tournament.matches.map((match) => (
              <div key={match._id}>
                <p>Команда 1: {match.team1}</p>
                <p>Команда 2: {match.team2}</p>
                <p>
                  Счет: {match.scoreTeam1} - {match.scoreTeam2}
                </p>
                <p>Победитель: {match.winner}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KnockoutTournament;
