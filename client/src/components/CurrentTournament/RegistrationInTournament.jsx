import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { getAllParticipate, participateInTournament } from '../../redux/features/participant/participantSlice';
import { checkIsAuth } from '../../redux/features/auth/authSlice';
import { toast } from 'react-toastify';

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
  const participants = useSelector((state) => state.participant.tournaments[tournamentId] || []);
	console.log(participants);

  useEffect(() => {
    if (tournamentId) {
      dispatch(getAllParticipate({ tournamentId }));
    }
  }, [dispatch, tournamentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tournamentId) {
      dispatch(participateInTournament({ userId, tournamentId }));
    }
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
          Чтобы участвовать в турнирах, необходимо{' '}
          <Link to="/registration">
            <span className="need-register">зарегистрироваться на сайте</span>
          </Link>
        </div>
      )}
      {/* Вывод участников турнира */}
      <div>
        <h2>Участники турнира:</h2>
        <ul>
          {participants.map((participant) => (
            <li key={participant._id}>{participant.username}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Registration;
