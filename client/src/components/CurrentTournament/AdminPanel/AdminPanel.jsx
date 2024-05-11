import React, { useEffect, useState } from 'react';
import styles from './AdminPanel.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllParticipate,
  acceptParticipant,
  rejectParticipant,
  acceptParticipantKnock,
} from '../../../redux/features/participant/participantSlice';
import Modal from '../../Modal/Modal';
import AcceptedParticipants from './AcceptedParticipants';

function TournamentRegistrations({ registrations, handleAccept, handleReject }) {
  return (
    <>
    
     <div className={styles['tournamentRegistrations']}>
      <h2 className={styles['tournamentRegistrations-title']}>Заявки:</h2>
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
    </>
   
  );
}

function AdminPanel() {
  const dispatch = useDispatch();
  const tournamentId = location.pathname.split('/')[2];
  const registrations = useSelector((state) => state.participant.pendingParticipants[tournamentId] || []);
  const [selectedMenu, setSelectedMenu] = useState('registrations');
  // Состояние для отслеживания открытия модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Состояние для отслеживания типа модального окна ('accept' или 'reject')
  const [modalType, setModalType] = useState(null);
  // Состояние для отслеживания ID участника, для которого отображается модальное окно
  const [participantId, setParticipantId] = useState(null);
  const participants = useSelector((state) => state.participant.acceptedParticipants[tournamentId] || []);
  console.log(participants);
  useEffect(() => {
    if (tournamentId) {
      dispatch(getAllParticipate({ tournamentId }));
    }
  }, [dispatch, tournamentId]);

  const handleAccept = (participantId) => {
    // Открываем модальное окно для подтверждения принятия участника
    setIsModalOpen(true);
    setModalType('accept');
    setParticipantId(participantId);
  };

  const handleReject = (participantId) => {
    // Открываем модальное окно для подтверждения отклонения участника
    setIsModalOpen(true);
    setModalType('reject');
    setParticipantId(participantId);
  };

  const handleCloseModal = () => {
    // Закрываем модальное окно
    setIsModalOpen(false);
    setModalType(null);
    setParticipantId(null);
  };

  const handleConfirmAction = async () => {
    // В зависимости от типа модального окна, отправляем запрос на принятие или отклонение участника
    try {
      if (modalType === 'accept') {
        await dispatch(acceptParticipant({ tournamentId, participantId }));
        await dispatch(acceptParticipantKnock({ tournamentId, participantId }));
      } else if (modalType === 'reject') {
        await dispatch(rejectParticipant({ tournamentId, participantId }));
      }
      // Закрываем модальное окно после подтверждения действия
      setIsModalOpen(false);
      setModalType(null);
      setParticipantId(null);
      // Обновляем список заявок на участие в турнире
      dispatch(getAllParticipate({ tournamentId }));
    } catch (error) {
      console.error('Ошибка при подтверждении действия:', error);
      // В случае ошибки также закрываем модальное окно
      setIsModalOpen(false);
      setModalType(null);
      setParticipantId(null);
    }
  };

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  }

  return (
    <div>
      <div className={styles['menu-btn_div']}>
      <button className={selectedMenu === 'registrations' ? styles['menu-button-active'] : styles['menu-button']} onClick={() => handleMenuClick('registrations')}>Заявки на участие в турнире</button>
      <button className={selectedMenu === 'accepted' ? styles['menu-button-active'] : styles['menu-button']} onClick={() => handleMenuClick('accepted')}>Участники турнира</button>
      </div>
      
      
      {selectedMenu === 'accepted' && <AcceptedParticipants/>}
      {selectedMenu === 'registrations' && <TournamentRegistrations registrations={registrations} handleAccept={handleAccept} handleReject={handleReject} />}
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <p className={styles['acceptOrReject']}>
            Вы уверены, что хотите {modalType === 'accept' ? 'принять' : 'отклонить'} этого участника?
          </p>
          <div className={styles['modal-actions']}>
            <div className={styles['acceptOrReject-container']}>
              <button className={styles['acceptOrReject-btn']} onClick={handleConfirmAction}>
                Подтвердить
              </button>
              <button className={styles['acceptOrReject-btn-cancel']} onClick={handleCloseModal}>
                Отмена
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default AdminPanel;
