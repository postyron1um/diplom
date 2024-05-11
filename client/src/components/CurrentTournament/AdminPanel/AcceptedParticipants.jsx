import React from 'react'
import { useSelector } from 'react-redux';
import styles from './AdminPanel.module.css';

function AcceptedParticipants() {
  const tournamentId = location.pathname.split('/')[2];
  const participants = useSelector((state) => state.participant.acceptedParticipants[tournamentId] || []);
  console.log(participants);
  return (
    <>
    <div>
        {/* <h2>Участники, которых вы приняли:</h2> */}
        <ul className={styles['accepted__ul']}>
          {participants.map((participant) => (
            <li className={styles['accepted__li']} key={participant._id}>{participant.username}</li>
          ))}
        </ul>
      </div>
    </>
    
  )
}

export default AcceptedParticipants;