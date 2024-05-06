import React, { useEffect } from 'react';
import styles from './AdminPanel.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { getAllParticipate, acceptParticipant, rejectParticipant } from '../../../redux/features//participant/participantSlice';

function TournamentRegistrations({ registrations, handleAccept, handleReject }) {
  return (
    <div className={styles['tournamentRegistrations']}>
      <h2 className={styles['tournamentRegistrations-title']}>Заявки на участие в турнире:</h2>
      <ul className={styles['tournamentRegistrations-ul']}>
        {registrations.map((registration) => (
          <li key={registration._id}>
            <div className={styles['tournamentRegistrations-row']}>
              <div>
                <span className={styles['tournamentRegistrations-span']}>
                  {registration.username} {registration.teamName}
                </span>
              </div>
              <div className={styles['tournamentRegistrations-div-end']}>
                <button className={styles['tournamentRegistrations-btn-accept']} onClick={() => handleAccept(registration._id)}>
                  Принять
                </button>
                <button className={styles['tournamentRegistrations-btn-reject']} onClick={() => handleReject(registration._id)}>
                  Отклонить
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AdminPanel() {
  const dispatch = useDispatch();
  const tournamentId = location.pathname.split('/')[2];
  const registrations = useSelector((state) => state.pendingParticipant.tournaments[tournamentId] || []);
console.log(registrations);
  useEffect(() => {
    if (tournamentId) {
      dispatch(getAllParticipate({ tournamentId }));
    }
  }, [dispatch, tournamentId]);

  const handleAccept = (participantId) => {
    dispatch(acceptParticipant({ tournamentId, participantId }));
  };

  const handleReject = (participantId) => {
    dispatch(rejectParticipant({ tournamentId, participantId }));
  };

  return (
    <div>
      <TournamentRegistrations registrations={registrations} handleAccept={handleAccept} handleReject={handleReject} />
    </div>
  );
}

export default AdminPanel;