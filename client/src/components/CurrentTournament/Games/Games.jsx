import React, { useEffect, useState } from 'react';
import styles from './Games.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { getAllParticipate } from '../../../redux/features/participant/participantSlice';
import { addMatch, fetchMatches, updateMatchResult } from '../../../redux/features/matchSlice/matchSlice';
import axios from '../../../utils/axios';
import { updateTournamentStatus } from '../../../redux/features/tournament/tournamentSlice';

const extractUserIdFromToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.roles;
  } catch (error) {
    console.error('Ошибка при извлечении ID пользователя из токена:', error);
    return null;
  }
};

function generateTournamentData(participantNames) {
  const numTeams = participantNames.length;
  const numRounds = numTeams - 1; // Количество туров
  const tournamentData = [];

  for (let round = 1; round <= numRounds; round++) {
    const roundMatches = [];

    // Генерируем матчи для текущего тура
    for (let i = 0; i < numTeams / 2; i++) {
      const matchData = {
        id: i + 1,
        team1: participantNames[i],
        team2: participantNames[numTeams - 1 - i],
        score1: 0, // Измененные поля для результатов каждой команды
        score2: 0, // Измененные поля для результатов каждой команды
        date: '04.04.2002',
        edited: false, // Флаг для отслеживания редактирования
      };
      roundMatches.push(matchData);
    }

    // Перемещаем команды, кроме первой, перед следующим туром
    if (round < numRounds) {
      const lastTeam = participantNames.pop();
      participantNames.splice(1, 0, lastTeam);
    }

    tournamentData.push({ round, matches: roundMatches });
  }

  return tournamentData;
}

function Games() {
  const dispatch = useDispatch();
  const [tournamentData, setTournamentData] = useState([]);
  const tournamentId = location.pathname.split('/')[2];
  const participants = useSelector((state) => state.participant.tournaments[tournamentId] || []);
  const matches = useSelector((state) => state.matches.matches); // Получаем матчи из состояния Redux
	// console.log(matches);
  // const [isTournamentStarted, setIsTournamentStarted] = useState(false);
  const userToken = localStorage.getItem('token');
  const role = extractUserIdFromToken(userToken);
  const isAdmin = role.includes('ADMIN');
  const isTournamentStarted = useSelector((state) => state.tournament.isTournamentStarted);
  // console.log(isTournamentStarted);
  useEffect(() => {
    if (tournamentId) {
      dispatch(getAllParticipate({ tournamentId }));
      dispatch(fetchMatches({ tournamentId }));
    }
  }, [dispatch, tournamentId]);

  useEffect(() => {
    if (participants?.length > 0) {
      setTournamentData(() => {
        const newTournamentData = generateTournamentData(participants.map((participant) => participant.username));
        return newTournamentData;
      });
    }
  }, [participants]);

  useEffect(() => {
    if (matches.length > 0) {
      // Обновляем состояние tournamentData после загрузки матчей из Redux
      setTournamentData((prevTournamentData) => {
        const updatedTournamentData = [...prevTournamentData];
        matches.forEach((match) => {
          const tournamentIndex = updatedTournamentData.findIndex((tournament) => tournament.round === match.round);
          if (tournamentIndex !== -1) {
            const matchIndex = updatedTournamentData[tournamentIndex].matches.findIndex(
              (m) => m.team1 === match.team1 && m.team2 === match.team2,
            );
            if (matchIndex !== -1) {
              updatedTournamentData[tournamentIndex].matches[matchIndex] = {
                ...updatedTournamentData[tournamentIndex].matches[matchIndex],
                score1: match.score1,
                score2: match.score2,
              };
            }
          }
        });
        return updatedTournamentData;
      });
    }
  }, [matches]);

  const handleEditSave = async (tournamentIndex, matchIndex) => {
    if (!isAdmin) return;
    try {
      const matchToUpdate = tournamentData[tournamentIndex].matches[matchIndex];
      const { score1, score2 } = matchToUpdate;
			console.log(matchToUpdate);
			console.log(matches);
    

      // Получаем ID матча из состояния Redux
      const matchId = matches.find((match) => match.team1 === matchToUpdate.team1 && match.team2 === matchToUpdate.team2)._id;
			console.log(matchId);
      // Если матч ранее не был отредактирован, устанавливаем edited в true
      if (!matchToUpdate.edited) {
        const updatedTournamentData = [...tournamentData];
        updatedTournamentData[tournamentIndex].matches[matchIndex].edited = true;
        setTournamentData(updatedTournamentData);
        return; // Прерываем выполнение функции, чтобы позволить пользователю редактировать данные
      }
      // Отправляем запрос на сервер для обновления матча
      await axios.put(`/tournaments/${tournamentId}/matches/${matchId}`, { matchId, score1, score2 });
      await axios.put(`/tournaments/${tournamentId}/matches/${matchId}/result`, { matchId, score1, score2 });
      // dispatch(updateMatchResult({ matchId, score1, score2, tournamentId })); // Вызываем действие updateMatchResult с параметрами
      // Обновляем состояние tournamentData после успешного обновления матча на сервере
      const updatedTournamentData = [...tournamentData];
      updatedTournamentData[tournamentIndex].matches[matchIndex].edited = false;
      setTournamentData(updatedTournamentData);
    } catch (error) {
      console.error('Ошибка при обновлении матча:', error);
    }
  };
  const handleInputChange = (tournamentIndex, matchIndex, field, value) => {
    const updatedTournamentData = [...tournamentData];
    if (field === 'team1' || field === 'team2') {
      updatedTournamentData[tournamentIndex].matches[matchIndex][field] = value;
    } else if (field === 'date') {
      updatedTournamentData[tournamentIndex].matches[matchIndex].date = value;
    } else if (field === 'score1' || field === 'score2') {
      updatedTournamentData[tournamentIndex].matches[matchIndex][field] = parseInt(value);
    }
    setTournamentData(updatedTournamentData);
  };

  const handleAddMatch = async () => {
    if (!isAdmin) return;
    try {
      // Генерируем данные для матчей
      const newTournamentData = generateTournamentData(participants.map((participant) => participant.username));

      // Добавляем каждый сгенерированный матч на сервер
      const newMatches = [];
      newTournamentData.forEach((tournament) => {
        tournament.matches.forEach((match) => {
          const matchData = {
            tournamentId,
            round: tournament.round,
            team1: match.team1,
            team2: match.team2,
            score1: match.score1,
            score2: match.score2,
          };
          newMatches.push(dispatch(addMatch({ matchData, tournamentId })));
        });
      });

      // Дожидаемся завершения всех запросов на добавление матчей
      await Promise.all(newMatches);

      // Обновляем состояние tournamentData после добавления новых матчей
      setTournamentData(newTournamentData);
      // await axios.put(`/tournaments/${tournamentId}/status`);
			 await dispatch(updateTournamentStatus({ tournamentId }));
    } catch (error) {
      console.error('Ошибка при добавлении матча:', error);
    }
  };
  return (
    <div>
      {isAdmin && !isTournamentStarted && <button onClick={handleAddMatch}>Начать турнир</button>}
      {tournamentData.map((tournament, tournamentIndex) => (
        <div key={tournamentIndex}>
          <p className={styles['round']}>Тур {tournament.round}</p>
          <div className="table-responsive">
            <table className={styles['table']}>
              <tbody>
                {tournament.matches.map((match, matchIndex) => (
                  <tr key={matchIndex}>
                    <td className={styles['col-4']}>
                      {match.edited ? (
                        <input
                          className={styles['edit-input']}
                          type="text"
                          value={match.team1}
                          onChange={(e) => handleInputChange(tournamentIndex, matchIndex, 'team1', e.target.value)}
                        />
                      ) : (
                        match.team1
                      )}
                    </td>
                    <td className={styles['col-2']}>
                      <span className={styles['edit']}>
                        {match.edited ? (
                          <input
                            className={styles['edit-input']}
                            type="text"
                            value={match.score1}
                            onChange={(e) => handleInputChange(tournamentIndex, matchIndex, 'score1', e.target.value)}
                          />
                        ) : (
                          match.score1
                        )}
                        :
                        {match.edited ? (
                          <input
                            className={styles['edit-input']}
                            type="text"
                            value={match.score2}
                            onChange={(e) => handleInputChange(tournamentIndex, matchIndex, 'score2', e.target.value)}
                          />
                        ) : (
                          match.score2
                        )}
                      </span>
                    </td>
                    <td className={styles['col-4']}>
                      {match.edited ? (
                        <input
                          className={styles['edit-input']}
                          type="text"
                          value={match.team2}
                          onChange={(e) => handleInputChange(tournamentIndex, matchIndex, 'team2', e.target.value)}
                        />
                      ) : (
                        match.team2
                      )}
                    </td>
                    <td className={styles['col-2']}>
                      {match.edited ? (
                        <input
                          className={styles['edit-input-date']}
                          type="date"
                          value={match.date}
                          onChange={(e) => handleInputChange(tournamentIndex, matchIndex, 'date', e.target.value)}
                        />
                      ) : (
                        match.date
                      )}
                    </td>
                    {isAdmin && (
                      <td>
                        <button onClick={() => handleEditSave(tournamentIndex, matchIndex)}>
                          {match.edited ? 'Сохранить' : 'Редактировать'}
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Games;
