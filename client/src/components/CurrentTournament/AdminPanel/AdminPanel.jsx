import React, { useState } from 'react';
import styles from './AdminPanel.module.css';
import { useLoaderData } from 'react-router-dom';

function TournamentRegistrations({ registrations, handleAccept, handleReject }) {
  let currentTournament = useLoaderData();
  console.log(currentTournament);
  return (
    <div className={styles['tournamentRegistrations']}>
      <h2 className={styles['tournamentRegistrations-title']}>Заявки на участие в турнире:</h2>
      <ul className={styles['tournamentRegistrations-ul']}>
        {registrations.map((registration) => (
          <li key={registration.id}>
            <div className={styles['tournamentRegistrations-row']}>
              <div>
                <span className={styles['tournamentRegistrations-span']}>
                  {registration.name} {registration.teamName}
                </span>
              </div>
              <div className={styles['tournamentRegistrations-div-end']}>
                <button className={styles['tournamentRegistrations-btn-accept']} onClick={() => handleAccept(registration.id)}>
                  Принять
                </button>
                <button className={styles['tournamentRegistrations-btn-reject']} onClick={() => handleReject(registration.id)}>
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

// function AdminPanel({ registrations, setRegistrations, setTournamentParticipants }) {
function AdminPanel() {
  const [registrations, setRegistrations] = useState(JSON.parse(localStorage.getItem('tournamentParticipants')) || []);

  const handleAccept = (id) => {
    const acceptedRegistration = registrations.find((reg) => reg.id === id);
    if (acceptedRegistration) {
      setRegistrations((prevRegistrations) => prevRegistrations.filter((reg) => reg.id !== id));
      localStorage.setItem('tournamentParticipants', JSON.stringify([...registrations.filter((reg) => reg.id !== id)]));
      localStorage.setItem(
        'tournamentAcceptedParticipants',
        JSON.stringify([...(JSON.parse(localStorage.getItem('tournamentAcceptedParticipants')) || []), acceptedRegistration]),
      );
    }
  };

  const handleReject = (id) => {
    setRegistrations((prevRegistrations) => prevRegistrations.filter((reg) => reg.id !== id));
    localStorage.setItem('tournamentParticipants', JSON.stringify([...registrations.filter((reg) => reg.id !== id)]));
  };

  return (
    <div>
      <TournamentRegistrations registrations={registrations} handleAccept={handleAccept} handleReject={handleReject} />
    </div>
  );
}

export default AdminPanel;
