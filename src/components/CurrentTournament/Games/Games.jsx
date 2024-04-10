import React from 'react';
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
        score: 'vs',
        date: '04.04.2002',
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
  const participants = JSON.parse(localStorage.getItem('tournamentAcceptedParticipants'));
  const participantNames = participants.map((participant) => participant.name);

  console.log(participantNames);

  const tournamentData = generateTournamentData(participantNames);

  return (
    <div>
      {tournamentData.map((tournament) => (
        <div key={tournament.round}>
          <p className={styles['round']}>Тур {tournament.round}</p>
          <div className="table-responsive">
            <table className={styles['table']}>
              <tbody>
                {tournament.matches.map((match, index) => (
                  <tr key={index}>
                    <td className={styles['col-4']}>{match.team1}</td>
                    <td className={styles['col-2']}>{match.score}</td>
                    <td className={styles['col-4']}>{match.team2}</td>
                    {/* Выводим счет */}
                    <td className={styles['col-1']}>{match.date}</td> {/* Выводим дату */}
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
