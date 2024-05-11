import React, { useEffect, useState } from 'react';
import styles from './KnockoutTournament.module.css';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../../utils/axios';
import extractUserRoleFromToken from '../../../Func/extractUserDetailsFromToken';

import { useLoaderData } from 'react-router-dom';

import { createNewMatch } from '../../../redux/features/knockout/knockoutSlice';

const KnockoutTournament = () => {
  let currentTournament = useLoaderData();
  const tournamentId = currentTournament._id;
  const userToken = localStorage.getItem('token');
  const role = extractUserRoleFromToken(userToken, 'roles');
  const isAdmin = role.includes('ADMIN');
  const [tournamentStarted, setTournamentStarted] = useState(false);

  const [participants, setParticipants] = useState([]); // тут лежат наши участники из бд
  const [roundMatches, setRoundMatches] = useState([]); // матчи турнира из бд
  const [champion, setChampion] = useState(null);
  const [editingMatch, setEditingMatch] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await fetch(`http://localhost:3007/api/tournaments/${tournamentId}/knockout/participants/accepted`);
        if (!response.ok) {
          throw new Error('Ошибка при получении данных о турнирах');
        }
        const data = await response.json();
        // console.log(data.participantsd);
        const storedParticipants = data.participantsd;
        if (storedParticipants) {
          setParticipants(storedParticipants);
        }
      } catch (error) {
        console.error('Ошибка:', error.message);
      }
    };

    fetchTournaments();
  }, [tournamentId]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        // Отправляем GET-запрос на сервер для получения матчей
        const response = await fetch(`http://localhost:3007/api/tournaments/${tournamentId}/knockout/matches`);
        // if (!response.data.success) {
        //   throw new Error('Ошибка при получении матчей');
        // }
        const data = await response.json();
        console.log(data.roundMatches);
        setRoundMatches(data.roundMatches);
      } catch (error) {
        console.error('Ошибка при получении матчей:', error.message);
      }
    };
    fetchMatches();
  }, [tournamentId]);

  // 	useEffect(() => {
  //   const isAllMatchesCompleted = roundMatches.every((round) =>
  //     round.every((match) => match.scoreTeam1 !== '' && match.scoreTeam2 !== '')
  //   );

  //   if (isAllMatchesCompleted) {
  //     const lastRoundIndex = roundMatches.length - 1;
  //     generateNextRound(lastRoundIndex, roundMatches);
  //   }
  // }, [roundMatches]);

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    // console.log(shuffledArray);
    return shuffledArray;
  };

  const generateRoundMatches = () => {
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
            round: i + 1, // Устанавливаем номер раунда
            team1: team1,
            team2: team2,
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
      shuffledParticipants = getRoundWinners(shuffledParticipants, roundMatches); // Обновляем участников для следующего раунда
    }
    console.log(initialRoundMatches);
    dispatch(createNewMatch({ initialRoundMatches, tournamentId }));
    setRoundMatches(initialRoundMatches);
    // setTournamentStarted(true); // Устанавливаем флаг, что турнир начался
    // // После начала турнира обновляем страницу
    // window.location.reload();
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
      updatedMatch[`scoreTeam${team}`] = parseInt(score);
      updatedRoundMatches[roundIndex][matchIndex] = updatedMatch;
      return updatedRoundMatches;
    });
  };

  const handleSaveResult = async (roundIndex, matchIndex) => {
    console.log(roundIndex);
    try {
      const matchToUpdate = roundMatches[roundIndex][matchIndex];
      console.log('matchToUpdate', matchToUpdate);
      const updatedMatch = {
        scoreTeam1: matchToUpdate.scoreTeam1,
        scoreTeam2: matchToUpdate.scoreTeam2,
        winner: matchToUpdate.scoreTeam1 > matchToUpdate.scoreTeam2 ? matchToUpdate.team1 : matchToUpdate.team2,
      };
      await axios.put(`/tournaments/${tournamentId}/knockout/matches/${matchToUpdate._id}`, { updatedMatch });
      setEditingMatch(null);

      // Проверяем, были ли сохранены все матчи текущего раунда
      const isAllMatchesSaved = roundMatches.every((round) =>
        round.every((match) => match.scoreTeam1 !== '' && match.scoreTeam2 !== ''),
      );
      if (isAllMatchesSaved) {
        console.log('FDFDF');
        await generateNextRound(roundIndex, roundMatches);
      }
    } catch (error) {
      console.error('Ошибка при сохранении результата матча:', error);
    }
  };

  const generateNextRound = async (completedRoundIndex, roundMatches) => {
    console.log(roundMatches);
    const updatedRoundMatches = [...roundMatches];
    console.log(updatedRoundMatches);
    const winnersOfCompletedRound = updatedRoundMatches[completedRoundIndex].map((match) => match.winner);
    // console.log('winnersOfCompletedRound', winnersOfCompletedRound);
    // if (winnersOfCompletedRound.every((winner) => winner !== null)) {
    //   console.log('6');
    // } else {
    // console.log('4');
    // }

    const nextRoundIndex = completedRoundIndex;
    // console.log('nextRoundIndex', nextRoundIndex);
    // console.log(updatedRoundMatches.length);
    if (nextRoundIndex < updatedRoundMatches.length) {
      // console.log('DSDS');
      if (winnersOfCompletedRound.every((winner) => winner !== null)) {
        const winnersOfNextRound = getRoundWinnersFromWinners(winnersOfCompletedRound, roundMatches[completedRoundIndex]);
        // console.log(winnersOfNextRound);
        const nextRoundMatches = [];
        for (let i = 0; i < Math.ceil(winnersOfNextRound.length / 2); i++) {
          const team1 = winnersOfNextRound[i * 2];
          const team2 = winnersOfNextRound[i * 2 + 1];
          // console.log(team1.username);
          if (team1 && team2) {
            const match = {
              id: i,
              round: nextRoundIndex + 1,
              team1: team1.username ? team1.username : team1,
              team2: team2.username ? team2.username : team2,
              scoreTeam1: '',
              scoreTeam2: '',
              winner: null,
            };
            nextRoundMatches.push(match);
          } else if (team1 && !team2) {
            nextRoundMatches.push({
              id: i,
              round: nextRoundIndex + 1,
              team1: team1.username ? team1.username : team1,
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
        console.log(nextRoundMatches);
        setRoundMatches(updatedRoundMatches);

        // Отправляем данные новых матчей следующего раунда на сервер
        try {
          // dispatch(createNewMatch({ initialRoundMatches: nextRoundMatches, tournamentId }));
          const response = await axios.post(`/tournaments/${tournamentId}/knockout/matches/next`, {
            initialRoundMatches: nextRoundMatches,
            tournamentId,
          });
          console.log('Новые матчи следующего раунда сохранены в базе данных:', response.data);
        } catch (error) {
          console.error('Ошибка при сохранении новых матчей следующего раунда:', error.message);
        }
      } else {
        console.log('Not all matches of the current round have been played yet.');
      }
    } else {
      console.log('JHJH');
      determineChampion();
    }
  };

  // use
  const getRoundWinnersFromWinners = (winnersOfCompletedRound, currentRoundMatches) => {
    console.log(winnersOfCompletedRound);
    console.log(currentRoundMatches);
    console.log(participants);
    const remainingParticipants = [];
    for (let i = 0; i < winnersOfCompletedRound.length; i++) {
      const winnerName = winnersOfCompletedRound[i];
      const winnerParticipant = participants.find((participant) => participant.username === winnerName);
      if (winnerParticipant) {
        remainingParticipants.push(winnerParticipant);
      } else {
        console.error(`Winner ${winnerName} not found in participants.`);
      }
    }
    console.log(remainingParticipants);
    return remainingParticipants;
  };

  useEffect(() => {
    if (roundMatches.length > 0) {
      determineChampion();
    }
  }, [roundMatches]);

  const determineChampion = async () => {
    const lastRound = roundMatches[roundMatches.length - 1];
    let championName = null;

    for (let i = 0; i < lastRound.length; i++) {
      const match = lastRound[i];
      if (match.scoreTeam1 !== '' && match.scoreTeam2 !== '') {
        if (match.scoreTeam1 > match.scoreTeam2) {
          championName = match.team1;
        } else if (match.scoreTeam2 > match.scoreTeam1) {
          championName = match.team2;
        } else {
          console.log('Match ended in a draw.');
          // В случае ничьей, вы можете обработать ситуацию по вашему усмотрению
        }
        break; // Прекращаем цикл после нахождения победителя
      }
    }

    if (championName) {
      setChampion(championName);
      await saveChampionToDatabase(championName); // Сохраняем чемпиона в базу данных
    } else {
      console.log('No champion determined yet.');
    }
  };

  const saveChampionToDatabase = async (championName) => {
    try {
      const response = await axios.put(`/tournaments/${tournamentId}/champion`, { champion: championName });
      console.log('Champion saved to database:', response.data);
    } catch (error) {
      console.error('Error saving champion to database:', error.message);
    }
  };

  const handleEditMatch = (roundIndex, matchIndex) => {
    setEditingMatch({ roundIndex, matchIndex });
  };

  // useEffect(() => {
  //   localStorage.setItem('tournamentRoundMatches', JSON.stringify(roundMatches));
  //   console.log();
  // }, [roundMatches]);

  // const showStartTournamentButton = !roundMatches || roundMatches.length === 0;

  // console.log(participants);
  // console.log(roundMatches);
  // roundMatches.map((round) => {
  //   console.log(round);
  // });
  return (
    <div>
      <h2 className={styles['h2-title']}>Турнир на вылет</h2>
      {roundMatches.map((round, roundIndex) => (
        <div className={styles['roundMatches']} key={roundIndex}>
          <h3>Round {roundIndex + 1}</h3>
          {round.map((match, matchIndex) => (
            <div key={matchIndex}>
              {isAdmin &&
              editingMatch !== null &&
              editingMatch.roundIndex === roundIndex &&
              editingMatch.matchIndex === matchIndex ? (
                <div className={styles['matchVs-div']}>
                  <p className={styles['matchVs']}>
                    {match.team1 && typeof match.team1 === 'object' ? match.team1.name : match.team1} vs{' '}
                    {match.team2 && typeof match.team2 === 'object' ? match.team2.name : match.team1}
                    <p>
                      Счет: {match.scoreTeam1} - {match.scoreTeam2}
                    </p>
                  </p>
                  <div className={styles['input-box']}>
                    <input
                      className={styles['input']}
                      type="number"
                      min="0"
                      value={match.scoreTeam1}
                      onChange={(e) => handleScoreChange(roundIndex, matchIndex, 1, e.target.value)}
                    />
                    <input
                      className={styles['input']}
                      type="number"
                      min="0"
                      value={match.scoreTeam2}
                      onChange={(e) => handleScoreChange(roundIndex, matchIndex, 2, e.target.value)}
                    />
                    {isAdmin ? (
                      <button className={styles['save_button']} onClick={() => handleSaveResult(roundIndex, matchIndex)}>
                        Сохранить
                      </button>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              ) : (
                <div className={styles['matchVs-div']}>
                  <p className={styles['matchVs']}>
                    {match.team1 && typeof match.team1 === 'object' ? match.team1.username : match.team1} vs{' '}
                    {match.team2 && typeof match.team2 === 'object' ? match.team2.username : match.team2}
                    {match.scoreTeam1 !== '' && match.scoreTeam2 !== '' && (
                      <p>
                        Счет: {match.scoreTeam1} - {match.scoreTeam2}
                      </p>
                    )}
                  </p>

                  {isAdmin ? (
                    <button
                      className={styles['edit_button']}
                      onClick={() => handleEditMatch(roundIndex, matchIndex, typeof match.team1, typeof match.team2)}>
                      Редактировать
                    </button>
                  ) : (
                    ''
                  )}
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
          {isAdmin
            ? !currentTournament.isStarted && isAdmin && <button onClick={generateRoundMatches}>Start Tournament</button>
            : ''}
        </div>
      )}
    </div>
  );
};

export default KnockoutTournament;
