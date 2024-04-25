import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkIsAuth } from '../../redux/features/auth/authSlice';
import { Link, useLoaderData } from 'react-router-dom';
import { getAllTournaments } from '../../redux/features/tournament/tournamentSlice';
import { getAllParticipate, participateInTournament } from '../../redux/features/participant/participantSlice';
import { toast } from 'react-toastify';

const extractUserIdFromToken = (token) => {
  try {
    // декодируем токен, разделяя его по точке и декодируя вторую часть, содержащую полезные данные
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id; // возвращаем ID пользователя
  } catch (error) {
    console.error('Ошибка при извлечении ID пользователя из токена:', error);
    return null;
  }
};

const Registration = () => {
  const dispatch = useDispatch();
  const userToken = localStorage.getItem('token');
  const isAuth = useSelector(checkIsAuth);
  const userId = extractUserIdFromToken(userToken);
  const { status } = useSelector((state) => state.participant);
  const { participants } = useSelector((state) => state.participant);
	console.log(participants);


  let currentTournament = useLoaderData();
  const tournamentId = currentTournament._id;

  useEffect(() => {
    dispatch(getAllTournaments());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllParticipate({ tournamentId }));
  }, [dispatch, tournamentId]);


  useEffect(() => {
    if (status) {
      toast(status);
    }
  }, [status]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(participateInTournament({ userId, tournamentId: tournamentId }));
  };

  return (
    <>
      <br />

      {isAuth ? (
        <div className="tournament-register">
          <div className="participant">
            <form onSubmit={handleSubmit}>
              <div className="participant-row">
                <button type="submit">Зарегистрироваться как участник</button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="no-access">
          Чтобы участовать в турнирах, нужно{' '}
          <Link to="/registration">
            <span className="need-register">зарегистрироваться на сайте</span>
          </Link>
        </div>
      )}
    </>
  );
};

export default Registration;

// const handleCreateTeam = (e) => {
//   const tournamentTeams = JSON.parse(localStorage.getItem('tournamentTeams')) || [];
//   e.preventDefault();
//   const team = {
//     id: Date.now(),
//     name: teamName,
//   };
//   localStorage.setItem('tournamentTeams', JSON.stringify([...tournamentTeams, team]));
//   setTeamName('');
// };

// import { useDispatch } from 'react-redux';
// import { participateInTournament } from '../../redux/features/tournament/tournamentSlice'; // Укажите правильный путь к вашему slice

// const Registration = () => {
//   const dispatch = useDispatch();

//   const handleParticipate = async () => {
//     try {
//       dispatch(participateInTournament());
//       console.log('Успешно участвовали в турнире!');
//     } catch (error) {
//       console.error('Ошибка при участии в турнире:', error);
//     }
//   };

//   return (
//     <>
//       <div className="participant">
//         <button onClick={handleParticipate}>Участвовать в турнире</button>
//       </div>
//     </>
//   );
// };

// export default Registration;
