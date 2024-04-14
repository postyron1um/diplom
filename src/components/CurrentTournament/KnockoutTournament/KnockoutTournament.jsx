import React, { useEffect, useState } from 'react';
import styles from './KnockoutTournament.module.css';

const KnockoutTournament = () => {
  const [participants, setParticipants] = useState([]);
  const [roundMatches, setRoundMatches] = useState([]);
  const [champion, setChampion] = useState(null);
  const [editingMatch, setEditingMatch] = useState(null);

  useEffect(() => {
    const storedParticipants = JSON.parse(localStorage.getItem('tournamentAcceptedParticipants'));

    if (storedParticipants) {
      setParticipants(storedParticipants);
    }
  }, []);

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const generateRoundMatches = () => {
    console.log('Generating round matches...');
    console.log('Participants:', participants);
    const numParticipants = participants.length;
    if (numParticipants % 2 !== 0) {
      console.error('Number of participants must be even for knockout tournament.');
      return;
    }

    const initialRoundMatches = [];
    const numRounds = Math.ceil(Math.log2(numParticipants));
    const matchesPerRound = numParticipants / 2;
    let shuffledParticipants = shuffleArray(participants);
    for (let i = 0; i < numRounds; i++) {
      const roundMatches = [];
      for (let j = 0; j < matchesPerRound; j++) {
        const team1 = shuffledParticipants[j * 2];
        const team2 = shuffledParticipants[j * 2 + 1];
        if (team1 && team2) {
          const match = {
            id: j,
            team1: team1.name, // Обновляем для доступа к свойству name
            team2: team2.name, // Обновляем для доступа к свойству name
            scoreTeam1: '',
            scoreTeam2: '',
            winner: null,
          };
          roundMatches.push(match);
        } else {
          console.error('Invalid participants in round match.');
        }
      }
      initialRoundMatches.push(roundMatches);
      shuffledParticipants = getRoundWinners(shuffledParticipants, initialRoundMatches[i]);
    }
    setRoundMatches(initialRoundMatches);
  };

  const getRoundWinners = (participants, matches) => {
    const winners = matches.map((match) => match.winner);
    const remainingParticipants = winners
      .filter((winner) => winner !== null)
      .map((winner) => {
        if (winner === 'team1') {
          return participants.find((participant) => participant.name === matches.find((match) => match.winner === 'team1').team1);
        } else if (winner === 'team2') {
          return participants.find((participant) => participant.name === matches.find((match) => match.winner === 'team2').team2);
        } else {
          return null;
        }
      });

    // Проверяем, что количество победителей равно количеству матчей
    if (remainingParticipants.length !== matches.length) {
      console.error('Invalid number of winners in round match.');
      return [];
    }

    return remainingParticipants;
  };

  const handleScoreChange = (roundIndex, matchIndex, team, score) => {
    setRoundMatches((prevRoundMatches) => {
      const updatedRoundMatches = [...prevRoundMatches];
      const updatedMatch = { ...updatedRoundMatches[roundIndex][matchIndex] };
      updatedMatch[`scoreTeam${team}`] = parseInt(score); // Преобразуем в число
      updatedRoundMatches[roundIndex][matchIndex] = updatedMatch;
      return updatedRoundMatches;
    });
  };

  const handleSaveResult = (roundIndex, matchIndex) => {
    console.log(`Saved result for round ${roundIndex + 1}, match ${matchIndex + 1}`);
    setRoundMatches((prevRoundMatches) => {
      const updatedRoundMatches = [...prevRoundMatches];
      const updatedMatch = { ...updatedRoundMatches[roundIndex][matchIndex] };
      updatedMatch.winner = updatedMatch.scoreTeam1 > updatedMatch.scoreTeam2 ? 'team1' : 'team2';
      updatedRoundMatches[roundIndex][matchIndex] = updatedMatch;

      // Clear editing match after saving result
      setEditingMatch(null);

      // Generate next round immediately after saving the result of a match
      console.log('Generating next round...');
      generateNextRound(roundIndex, updatedRoundMatches);

      return updatedRoundMatches;
    });
  };

  const generateNextRound = (completedRoundIndex, roundMatches) => {
    const updatedRoundMatches = [...roundMatches];
    const winnersOfCompletedRound = updatedRoundMatches[completedRoundIndex].map((match) => match.winner);
    console.log('Winners of completed round:', winnersOfCompletedRound);
    const nextRoundIndex = completedRoundIndex + 1;

    // Проверяем, все ли матчи текущего раунда сыграны
    if (winnersOfCompletedRound.every((winner) => winner !== null)) {
      const winnersOfNextRound = getRoundWinnersFromWinners(winnersOfCompletedRound, roundMatches[completedRoundIndex]);
      const nextRoundMatches = [];
      for (let i = 0; i < Math.ceil(winnersOfNextRound.length / 2); i++) {
        const team1 = winnersOfNextRound[i * 2];
        const team2 = winnersOfNextRound[i * 2 + 1];
        console.log('Team 1:', team1, 'Team 2:', team2);
        if (team1 && team2) {
          const match = {
            id: i,
            team1: team1.name ? team1.name : team1,
            team2: team2.name ? team2.name : team2,
            scoreTeam1: '',
            scoreTeam2: '',
            winner: null,
          };
          nextRoundMatches.push(match);
        } else if (team1 && !team2) {
          nextRoundMatches.push({
            id: i,
            team1: team1.name ? team1.name : team1,
            team2: null,
            scoreTeam1: '',
            scoreTeam2: '',
            winner: null,
          });
        } else {
          console.error('Invalid participants in round match.');
        }
      }

      updatedRoundMatches[nextRoundIndex] = nextRoundMatches;
      setRoundMatches(updatedRoundMatches);
    } else {
      console.log('Not all matches of the current round have been played yet.');
    }
  };
  const getRoundWinnersFromWinners = (winnersOfCompletedRound, currentRoundMatches) => {
    const remainingParticipants = [];
    for (let i = 0; i < winnersOfCompletedRound.length; i++) {
      if (winnersOfCompletedRound[i] === 'team1') {
        remainingParticipants.push(participants.find((participant) => participant.name === currentRoundMatches[i].team1));
      } else if (winnersOfCompletedRound[i] === 'team2') {
        remainingParticipants.push(participants.find((participant) => participant.name === currentRoundMatches[i].team2));
      }
    }
    return remainingParticipants;
  };

  useEffect(() => {
    if (roundMatches.length > 0) {
      determineChampion();
    }
  }, [roundMatches]);

  const determineChampion = () => {
    console.log('Determining champion...');
    console.log('Round matches:', roundMatches);
    const lastRoundWinners = roundMatches[roundMatches.length - 1].map((match) => match.winner);
    const championTeam = lastRoundWinners.find((winner) => winner !== null);
    if (championTeam) {
      const lastRound = roundMatches[roundMatches.length - 1];
      for (let i = 0; i < lastRound.length; i++) {
        if (lastRound[i].winner === championTeam) {
          setChampion(championTeam === 'team1' ? lastRound[i].team1 : lastRound[i].team2);
          return;
        }
      }
    } else {
      console.log('No champion determined yet.');
    }
  };

  const handleEditMatch = (roundIndex, matchIndex) => {
    setEditingMatch({ roundIndex, matchIndex });
  };

  return (
    <div>
      <h2 className={styles['h2-title']}>Турнир на вылет</h2>
      {roundMatches.map((round, roundIndex) => (
        <div className={styles['roundMatches']} key={roundIndex}>
          <h3>Round {roundIndex + 1}</h3>
          {round.map((match, matchIndex) => (
            <div key={matchIndex}>
              {editingMatch !== null && editingMatch.roundIndex === roundIndex && editingMatch.matchIndex === matchIndex ? (
                <div className={styles['matchVs-div']}>
                  <p className={styles['matchVs']}>
                    {match.team1 && match.team1.name ? match.team1.name : match.team1} vs{' '}
                    {match.team2 && match.team2.name ? match.team2.name : match.team2}
                    <p>
                      Счет: {match.scoreTeam1} - {match.scoreTeam2}
                    </p>
                    {/* )} */}
                  </p>
                  <div className={styles['input-box']}>
                    {' '}
                    <input
                      type="number"
                      value={match.scoreTeam1}
                      onChange={(e) => handleScoreChange(roundIndex, matchIndex, 1, e.target.value)}
                    />
                    <input
                      type="number"
                      value={match.scoreTeam2}
                      onChange={(e) => handleScoreChange(roundIndex, matchIndex, 2, e.target.value)}
                    />
                    <button className={styles['save_button']} onClick={() => handleSaveResult(roundIndex, matchIndex)}>
                      Сохранить
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles['matchVs-div']}>
                  <p className={styles['matchVs']}>
                    {match.team1 && match.team1.name ? match.team1.name : match.team1} vs{' '}
                    {match.team2 && match.team2.name ? match.team2.name : match.team2}
                    {match.scoreTeam1 !== '' && match.scoreTeam2 !== '' && (
                      <p>
                        Счет: {match.scoreTeam1} - {match.scoreTeam2}
                      </p>
                    )}
                  </p>

                  <button className={styles['edit_button']} onClick={() => handleEditMatch(roundIndex, matchIndex)}>
                    Редактировать
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
      {champion !== null ? (
        <div className={styles['champion']}>
          <h3 className={styles['champion-title']}>Champion</h3>
          <p className={styles['champion-name']}>{champion}</p>
        </div>
      ) : (
        <div>
          <button onClick={generateRoundMatches}>Start Tournament</button>
        </div>
      )}
    </div>
  );
};

export default KnockoutTournament;
