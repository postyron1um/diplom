import React, { useEffect, useState } from 'react';
import styles from './KnockoutTournament.module.css';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../../utils/axios';
import extractUserRoleFromToken from '../../../Func/extractUserDetailsFromToken';
import agf from '../../../../public/vite.svg';
import { useLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createNewMatch } from '../../../redux/features/knockout/knockoutSlice';

const KnockoutTournament = () => {
  let currentTournament = useLoaderData();
  const tournamentId = currentTournament._id;
  const userToken = localStorage.getItem('token');
  const role = extractUserRoleFromToken(userToken, 'roles');

  const isAdmin = Array.isArray(role) && role.includes('ADMIN');
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
        const response = await fetch(`http://localhost:3007/api/tournaments/${tournamentId}/knockout/matches`);
        const data = await response.json();
        setRoundMatches(data.roundMatches);
      } catch (error) {
        console.error('Ошибка при получении матчей:', error.message);
      }
    };
    fetchMatches();
  }, [tournamentId]);

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const generateRoundMatches = () => {
    const numParticipants = participants.length;
    if (numParticipants % 2 !== 0) {
      toast.error('Количество участников должно быть четным для турнира на вылет.');
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
            round: i + 1,
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
      shuffledParticipants = getRoundWinners(shuffledParticipants, roundMatches);
    }
    dispatch(createNewMatch({ initialRoundMatches, tournamentId }));
    setRoundMatches(initialRoundMatches);
    toast.success('Турнир успешно');
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
	console.log(roundMatches);
  const handleSaveResult = async (roundIndex, matchIndex) => {
    try {
      const matchToUpdate = roundMatches[roundIndex][matchIndex];
      const updatedMatch = {
        scoreTeam1: matchToUpdate.scoreTeam1,
        scoreTeam2: matchToUpdate.scoreTeam2,
        winner: matchToUpdate.scoreTeam1 > matchToUpdate.scoreTeam2 ? matchToUpdate.team1 : matchToUpdate.team2,
      };
      await axios.put(`/tournaments/${tournamentId}/knockout/matches/${matchToUpdate._id}`, { updatedMatch });
      setEditingMatch(null);

      // Проверяем, были ли сохранены все матчи текущего раунда
      const isAllMatchesSaved = roundMatches[roundIndex].every((match) => match.scoreTeam1 !== '' && match.scoreTeam2 !== '');
      if (isAllMatchesSaved) {
        setRoundMatches((prevRoundMatches) => {
          const updatedRoundMatches = [...prevRoundMatches];
          updatedRoundMatches[roundIndex] = updatedRoundMatches[roundIndex].map((match, index) =>
            index === matchIndex ? { ...match, ...updatedMatch } : match,
          );
          return updatedRoundMatches;
        });
      }
    } catch (error) {
      console.error('Ошибка при сохранении результата матча:', error);
    }
  };

  const generateNextRound = async (completedRoundIndex) => {
    const winnersOfCompletedRound = roundMatches[completedRoundIndex].map((match) => match.winner);
    const nextRoundMatches = [];
    for (let i = 0; i < winnersOfCompletedRound.length; i += 2) {
      const team1 = winnersOfCompletedRound[i];
      const team2 = winnersOfCompletedRound[i + 1];
      if (team1 && team2) {
        const match = {
          id: i / 2,
          round: completedRoundIndex + 2,
          team1: team1,
          team2: team2,
          scoreTeam1: '',
          scoreTeam2: '',
          winner: null,
        };
        nextRoundMatches.push(match);
      } else if (team1 && !team2) {
        nextRoundMatches.push({
          id: i / 2,
          round: completedRoundIndex + 2,
          team1: team1,
          team2: null,
          scoreTeam1: '',
          scoreTeam2: '',
          winner: null,
        });
      } else {
        console.error('Invalid participants in round match.');
      }
    }
    setRoundMatches((prevRoundMatches) => {
      const updatedRoundMatches = [...prevRoundMatches, nextRoundMatches];
      return updatedRoundMatches;
    });

    try {
      await axios.post(`/tournaments/${tournamentId}/knockout/matches/next`, {
        initialRoundMatches: nextRoundMatches,
        tournamentId,
      });
    } catch (error) {
      console.error('Ошибка при сохранении новых матчей следующего раунда:', error.message);
    }
    window.location.reload();
  };

  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        const response = await axios.get(`http://localhost:3007/api/tournaments/${tournamentId}`);
        if (!response.data.tournament) {
          throw new Error('Ошибка при получении данных о турнире');
        }

        const tournamentData = response.data.tournament;
        const storedChampion = tournamentData[0].champion;
        // console.log(storedChampion);
        if (tournamentData) {
          setChampion(storedChampion);
        }
      } catch (error) {
        console.error('Ошибка:', error.message);
      }
    };

    fetchTournamentData();
  }, [tournamentId]);
	
  const determineChampion = async () => {
    const lastRound = roundMatches[roundMatches.length - 1];
    let championName = null;

    for (let i = 0; i < lastRound.length; i++) {
      const match = lastRound[i];
      if (match.scoreTeam1 !== '' && match.scoreTeam2 !== '') {
        if (match.scoreTeam1 > match.scoreTeam2) {
          championName = match.team1;
        } else {
          championName = match.team2;
        }
      }
    }

    if (championName) {
      setChampion(championName);
      try {
        await axios.put(`/tournaments/${tournamentId}/champion`, { champion: championName });
      } catch (error) {
        console.error('Ошибка при обновлении чемпиона:', error.message);
      }
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
              {isAdmin &&
              editingMatch !== null &&
              editingMatch.roundIndex === roundIndex &&
              editingMatch.matchIndex === matchIndex ? (
                <div className={styles['matchVs-div']}>
                  <p className={styles['matchVs']}>
                    {match.team1 && typeof match.team1 === 'object' ? match.team1.username : match.team1} vs{' '}
                    {match.team2 && typeof match.team2 === 'object' ? match.team2.username : match.team2}
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
                      onClick={() => handleEditMatch(roundIndex, matchIndex, match.team1, match.team2)}>
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
      {!champion &&
        isAdmin &&
        roundMatches.length > 0 &&
        roundMatches.every((round) => round.every((match) => match.scoreTeam1 !== 0 || match.scoreTeam2 !== 0)) && (
          <button className={styles.btn} onClick={() => generateNextRound(roundMatches.length - 1)}>
            Создать следующий раунд
          </button>
        )}
      {champion !== null ? (
        <div className={styles['champion']}>
          <h3 className={styles['champion-title']}>Champion</h3>
          <p className={styles['champion-name']}>{champion}</p>
        </div>
      ) : (
        <div>
          {isAdmin
            ? !currentTournament.isStarted &&
              isAdmin && (
                <button className={styles['start_btn']} onClick={generateRoundMatches}>
                  Начать турнир
                </button>
              )
            : ''}
          {isAdmin &&
            roundMatches.length > 0 &&
            roundMatches.every((round) => round.every((match) => match.scoreTeam1 !== '' && match.scoreTeam2 !== '')) && // Проверяем, что все матчи всех раундов завершены
            roundMatches[roundMatches.length - 1].length === 1 && // Проверяем, что в последнем раунде остался только один матч
            roundMatches[roundMatches.length - 1].every((match) => match.scoreTeam1 !== 0 || match.scoreTeam2 !== 0) && ( // Проверяем, что все матчи последнего раунда не имеют 0 очков
              <button className={styles['champion_btn']} onClick={determineChampion}>
                Определить чемпиона
              </button>
            )}
        </div>
      )}
    </div>
  );
};

export default KnockoutTournament;
