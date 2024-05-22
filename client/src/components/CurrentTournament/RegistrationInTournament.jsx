import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLoaderData, useLocation } from 'react-router-dom';
import {
  getAllParticipate,
  // registerInRoundTournament,
  // registerInKnockoutTournament,
	participateInTournament,
  participateInTournamentKnock,
} from '../../redux/features/participant/participantSlice';
import { checkIsAuth } from '../../redux/features/auth/authSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const extractUserIdFromToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id;
  } catch (error) {
    console.error('Ошибка при извлечении ID пользователя из токена:', error);
    return null;
  }
};

const Registration = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(checkIsAuth);
  const userToken = localStorage.getItem('token');
  const userId = extractUserIdFromToken(userToken);
  const location = useLocation();
  const tournamentId = location.pathname.split('/')[2];
	// console.log(userId);
  const participants = useSelector((state) => state.participant.acceptedParticipants[tournamentId] || []);
  const { status } = useSelector((state) => state.participant);

let currentTournament = useLoaderData();
const typeTournament = currentTournament.typeTournament;
console.log(typeTournament);

  useEffect(() => {
    if (status) {
      toast.success(status);
    }
  }, [status]);

  useEffect(() => {
    if (tournamentId) {
      dispatch(getAllParticipate({ tournamentId }));
    }
  }, [dispatch, tournamentId]);

  const handleRoundTournamentRegistration = async (e) => {
    e.preventDefault();
    if (tournamentId) {
      dispatch(participateInTournament({ userId, tournamentId }));
    }
  };

  const handleKnockoutTournamentRegistration = async (e) => {
    e.preventDefault();
    if (tournamentId) {
      dispatch(participateInTournamentKnock({ userId, tournamentId }));
    }
  };

  return (
    <>
      <br />
      {isAuth ? (
        <div className="tournament-register">
          <div className="participant">
            {typeTournament === 'Круговой' ? (
              <form onSubmit={handleRoundTournamentRegistration}>
                <div className="participant-row">
                  <button type="submit">Зарегистрироваться как участник на круговом турнире</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleKnockoutTournamentRegistration}>
                <div className="participant-row">
                  <button type="submit">Зарегистрироваться как участник в турнире на вылет</button>
                </div>
              </form>
            )}

          </div>
        </div>
      ) : (
        <div className="no-access">
          Чтобы участвовать в турнирах, необходимо{' '}
          <Link to="/registration">
            <span className="need-register">зарегистрироваться на сайте</span>
          </Link>
        </div>
      )}
      {/* Вывод участников турнира */}
     
    </>
  );
};

export default Registration;
