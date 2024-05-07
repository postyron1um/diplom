import React, { useEffect, useState } from 'react';
import styles from './AdminPanel.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { getAllParticipate, acceptParticipant, rejectParticipant } from '../../../redux/features/participant/participantSlice';
import Modal from '../../Modal/Modal';


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
  const registrations = useSelector((state) => state.participant.pendingParticipants[tournamentId] || []);

  // Состояние для отслеживания открытия модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Состояние для отслеживания типа модального окна ('accept' или 'reject')
  const [modalType, setModalType] = useState(null);
  // Состояние для отслеживания ID участника, для которого отображается модальное окно
  const [participantId, setParticipantId] = useState(null);

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

  const handleConfirmAction = () => {
    // В зависимости от типа модального окна, отправляем запрос на принятие или отклонение участника
    if (modalType === 'accept') {
      dispatch(acceptParticipant({ tournamentId, participantId }));
    } else if (modalType === 'reject') {
      dispatch(rejectParticipant({ tournamentId, participantId }));
    }
    // Закрываем модальное окно после подтверждения действия
    setIsModalOpen(false);
    setModalType(null);
    setParticipantId(null);
  };

  return (
    <div>
      <TournamentRegistrations registrations={registrations} handleAccept={handleAccept} handleReject={handleReject} />
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
