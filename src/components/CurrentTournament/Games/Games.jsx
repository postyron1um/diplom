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

function Games({ onUpdateTableData }) {
  const [tournamentData, setTournamentData] = useState([]);
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    const storedTournamentData = JSON.parse(localStorage.getItem('tournamentData'));
    if (storedTournamentData) {
      setTournamentData(storedTournamentData);
    } else {
      const participants = JSON.parse(localStorage.getItem('tournamentAcceptedParticipants'));
      if (participants) {
        const participantNames = participants.map((participant) => participant.name);
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
      match.edited = false;
      localStorage.setItem('tournamentData', JSON.stringify(updatedTournamentData));
    } else {
      match.edited = true;
    }
    setTournamentData(updatedTournamentData);
    updateTableData(updatedTournamentData);
  };

  const handleInputChange = (tournamentIndex, matchIndex, field, value) => {
    const updatedTournamentData = [...tournamentData];
    const match = updatedTournamentData[tournamentIndex].matches[matchIndex];
    if (field === 'team1') {
      match.score1 = value;
    } else if (field === 'team2') {
      match.score2 = value;
    } else if (field === 'date') {
      match.date = value;
    }
    setTournamentData(updatedTournamentData);
    updateTableData(updatedTournamentData);
  };

  const updateTableData = (data) => {
    const updatedTableData = [];
    data.forEach((tournament) => {
      tournament.matches.forEach((match) => {
        const team1Name = match.team1;
        const team2Name = match.team2;
        const team1Score = parseInt(match.score1);
        const team2Score = parseInt(match.score2);
        const team1Goals = team1Score;
        const team2Goals = team2Score;
        const team1Wins = team1Score > team2Score ? 1 : 0;
        const team2Wins = team2Score > team1Score ? 1 : 0;
        const team1Draws = team1Score === team2Score ? 1 : 0;
        const team2Draws = team1Score === team2Score ? 1 : 0;
        const team1Losses = team2Score > team1Score ? 1 : 0;
        const team2Losses = team1Score > team2Score ? 1 : 0;

        updateTeamData(updatedTableData, team1Name, team1Goals, team1Wins, team1Draws, team1Losses);
        updateTeamData(updatedTableData, team2Name, team2Goals, team2Wins, team2Draws, team2Losses);
      });
    });

    setTableData(updatedTableData);
    localStorage.setItem('tableData', JSON.stringify(updatedTableData));
    onUpdateTableData(updatedTableData);
  };

  const updateTeamData = (tableData, teamName, goals, wins, draws, losses) => {
    const teamIndex = tableData.findIndex((team) => team.name === teamName);
    if (teamIndex === -1) {
      tableData.push({
        name: teamName,
        goals,
        matches: 1,
        wins,
        draws,
        losses,
        goalsFor: goals,
        goalsAgainst: 0,
      });
    } else {
      tableData[teamIndex].goals += goals;
      tableData[teamIndex].matches += 1;
      tableData[teamIndex].wins += wins;
      tableData[teamIndex].draws += draws;
      tableData[teamIndex].losses += losses;
      tableData[teamIndex].goalsFor += goals;
    }
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
                        {match.edited ? (
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
                        {match.edited ? (
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
                    <td className={styles['col-2']}>
                      <input
                        className={styles['edit-input-date']}
                        type="date"
                        value={match.date}
                        onChange={(e) => handleInputChange(tournamentIndex, matchIndex, 'date', e.target.value)}
                      />
                    </td>
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
