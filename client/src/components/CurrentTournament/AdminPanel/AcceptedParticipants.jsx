import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './AdminPanel.module.scss';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPhone, FaClipboard } from 'react-icons/fa';

function AcceptedParticipants() {
  const tournamentId = location.pathname.split('/')[2];
  const participants = useSelector((state) => state.participant.acceptedParticipants[tournamentId] || []);
  const [visiblePhones, setVisiblePhones] = useState({});

  const togglePhoneVisibility = (participantId) => {
    setVisiblePhones((prevState) => ({
      ...prevState,
      [participantId]: !prevState[participantId],
    }));
  };

  const copyToClipboard = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        toast.success('Номер телефона скопирован!');
      }).catch((err) => {
        console.error('Ошибка при копировании номера телефона:', err);
        toast.error('Ошибка при копировании номера телефона.');
      });
    } else {
      // Фолбэк для браузеров, которые не поддерживают navigator.clipboard
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success('Номер телефона скопирован!');
      } catch (err) {
        console.error('Ошибка при копировании номера телефона:', err);
        toast.error('Ошибка при копировании номера телефона.');
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className={styles['AcceptedParticipants']}>
      <h2>Участники, которых вы приняли:</h2>
      <ul className={styles['accepted__ul']}>
        {participants.map((participant) => (
          <li className={styles['accepted__li']} key={participant._id}>
            {participant.username} 
            <button 
              className={styles['toggle-phone-button']} 
              onClick={() => togglePhoneVisibility(participant._id)}
            ><FaPhone />
            </button>
            <br />
            {visiblePhones[participant._id] && (
              <>
                {participant.tel}
                <button 
                  className={styles['copy-button']} 
                  onClick={() => copyToClipboard(participant.tel)}
                >
                  <FaClipboard />
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AcceptedParticipants;
