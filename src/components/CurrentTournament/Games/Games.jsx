import React, { useEffect, useState } from 'react';
import styles from './Games.module.css';

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
        score1: '0', // Измененные поля для результатов каждой команды
        score2: '0', // Измененные поля для результатов каждой команды
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
  const [tournamentData, setTournamentData] = useState([]);

  useEffect(() => {
    const participants = JSON.parse(localStorage.getItem('tournamentAcceptedParticipants'));
    if (participants) {
      const participantNames = participants.map((participant) => participant.name);
      const storedTournamentData = JSON.parse(localStorage.getItem('tournamentData'));
      if (storedTournamentData) {
        setTournamentData(storedTournamentData);
      } else {
        const newTournamentData = generateTournamentData(participantNames);
        setTournamentData(newTournamentData);
        localStorage.setItem('tournamentData', JSON.stringify(newTournamentData));
      }
    }
  }, []);

  const handleEditSave = (tournamentIndex, matchIndex) => {
    const updatedTournamentData = [...tournamentData];
    const match = updatedTournamentData[tournamentIndex].matches[matchIndex];
    if (match.edited) {
      // Если матч редактировался, сохраняем изменения и сбрасываем флаг
      match.edited = false;
      localStorage.setItem('tournamentData', JSON.stringify(updatedTournamentData)); // Сохраняем обновленные данные
    } else {
      // Если матч не редактировался, переключаем на режим редактирования
      match.edited = true;
    }
    setTournamentData(updatedTournamentData);
  };

  const handleInputChange = (tournamentIndex, matchIndex, team, value) => {
    // Обновляем значения только для редактируемых матчей
    const updatedTournamentData = [...tournamentData];
    const match = updatedTournamentData[tournamentIndex].matches[matchIndex];
    if (team === 'team1') {
      match.score1 = value;
    } else if (team === 'team2') {
      match.score2 = value;
    }
    setTournamentData(updatedTournamentData);
  };

  return (
    <div>
      {tournamentData.map((tournament, tournamentIndex) => (
        <div key={tournamentIndex}>
          <p className={styles['round']}>Тур {tournament.round}</p>
          <div className="table-responsive">
            <table className={styles['table']}>
              <tbody>
                {tournament.matches.map((match, matchIndex) => (
                  <tr key={matchIndex}>
                    <td className={styles['col-4']}>{match.team1}</td>
                    <td className={styles['col-2']}>
                      <span className={styles['edit']}>
                        {match.edited ? ( // Показываем инпут только для редактируемых матчей
                          <input
                            className={styles['edit-input']}
                            type="text"
                            value={match.score1}
                            onChange={(e) => handleInputChange(tournamentIndex, matchIndex, 'team1', e.target.value)}
                          />
                        ) : (
                          match.score1
                        )}
                        :
                        {match.edited ? ( // Показываем инпут только для редактируемых матчей
                          <input
                            className={styles['edit-input']}
                            type="text"
                            value={match.score2}
                            onChange={(e) => handleInputChange(tournamentIndex, matchIndex, 'team2', e.target.value)}
                          />
                        ) : (
                          match.score2
                        )}
                      </span>
                    </td>
                    <td className={styles['col-4']}>{match.team2}</td>
                    <td className={styles['col-2']}></td>
                    <td>
                      <button onClick={() => handleEditSave(tournamentIndex, matchIndex)}>
                        {match.edited ? 'Сохранить' : 'Редактировать'}
                      </button>
                    </td>
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
