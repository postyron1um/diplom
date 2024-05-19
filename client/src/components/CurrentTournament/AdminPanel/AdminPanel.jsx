import React, { useEffect, useState } from 'react';
import styles from './AdminPanel.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllParticipate,
  acceptParticipant,
  rejectParticipant,
  acceptParticipantKnock,
} from '../../../redux/features/participant/participantSlice';
import Modal from '../../Modal/Modal';
import AcceptedParticipants from './AcceptedParticipants';
import axios from '../../../utils/axios';
import { deleteTournament } from '../../../redux/features/tournament/tournamentSlice';
import EditTournament from './EditTournament';

function TournamentRegistrations({ registrations, handleAccept, handleReject }) {
  return (
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
  );
}

function AdminPanel() {
  const dispatch = useDispatch();
  const tournamentId = location.pathname.split('/')[2];
  const registrations = useSelector((state) => state.participant.pendingParticipants[tournamentId] || []);
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState('registrations');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [participantId, setParticipantId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteInputValue, setDeleteInputValue] = useState('');
  const [tournamentData, setTournamentData] = useState({
    title: '',
    sportType: '',
    typeTournament: '',
    tournamentDesc: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (tournamentId) {
      dispatch(getAllParticipate({ tournamentId }));

      axios
        .get(`/tournaments/${tournamentId}`)
        .then((response) => {
          const tournament = response.data.tournament[0];
          setTournamentData({
            title: tournament.title,
            sportType: tournament.sportType,
            typeTournament: tournament.typeTournament,
            tournamentDesc: tournament.tournamentDesc,
            startDate: tournament.startDate,
            endDate: tournament.endDate,
          });
        })
        .catch((error) => {
          console.error('Ошибка при получении данных турнира:', error);
        });
    }
  }, [dispatch, tournamentId]);

  const handleAccept = (participantId) => {
    setIsModalOpen(true);
    setModalType('accept');
    setParticipantId(participantId);
  };

  const handleReject = (participantId) => {
    setIsModalOpen(true);
    setModalType('reject');
    setParticipantId(participantId);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setParticipantId(null);
  };

  const handleConfirmAction = async () => {
    try {
      if (modalType === 'accept') {
        await dispatch(acceptParticipant({ tournamentId, participantId }));
        await dispatch(acceptParticipantKnock({ tournamentId, participantId }));
      } else if (modalType === 'reject') {
        await dispatch(rejectParticipant({ tournamentId, participantId }));
      }
      setIsModalOpen(false);
      setModalType(null);
      setParticipantId(null);
      dispatch(getAllParticipate({ tournamentId }));
    } catch (error) {
      console.error('Ошибка при подтверждении действия:', error);
      setIsModalOpen(false);
      setModalType(null);
      setParticipantId(null);
    }
  };

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTournamentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDeleteTournament = async () => {
    try {
      await dispatch(deleteTournament({ tournamentId }));
      await navigate('/alltournaments');
    } catch (error) {
      console.error('Ошибка при удалении турнира:', error);
      alert('Ошибка при удалении турнира');
    }
  };

  const handleEditTournament = async () => {
    try {
      await dispatch(updateTournament({ tournamentId, ...tournamentData }));
      alert('Турнир успешно обновлен');
    } catch (error) {
      console.error('Ошибка при редактировании турнира:', error);
      alert('Ошибка при редактировании турнира');
    }
  };

  return (
    <div>
      <div className={styles['menu-btn_div']}>
        <button
          className={selectedMenu === 'registrations' ? styles['menu-button-active'] : styles['menu-button']}
          onClick={() => handleMenuClick('registrations')}>
          Заявки на участие в турнире
        </button>
        <button
          className={selectedMenu === 'accepted' ? styles['menu-button-active'] : styles['menu-button']}
          onClick={() => handleMenuClick('accepted')}>
          Участники турнира
        </button>
        <button
          className={selectedMenu === 'edit' ? styles['menu-button-active'] : styles['menu-button']}
          onClick={() => handleMenuClick('edit')}>
          Редактировать турнир
        </button>
        <button
          className={selectedMenu === 'delete' ? styles['menu-button-active'] : styles['menu-button']}
          onClick={() => setIsDeleteModalOpen(true)}>
          Удалить турнир
        </button>
      </div>

      {selectedMenu === 'accepted' && <AcceptedParticipants />}
      {selectedMenu === 'edit' && (
        <EditTournament
          tournamentId={tournamentId}
        />
      )}
      {selectedMenu === 'registrations' && (
        <TournamentRegistrations registrations={registrations} handleAccept={handleAccept} handleReject={handleReject} />
      )}

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
      {isDeleteModalOpen && (
        <Modal onClose={() => setIsDeleteModalOpen(false)}>
          <p className={styles['acceptOrReject']}>
            Вы уверены, что хотите удалить этот турнир? Введите название турнира ({tournamentData.title}) для подтверждения:
          </p>
          <input
            type="text"
            value={deleteInputValue}
            onChange={(e) => setDeleteInputValue(e.target.value)}
            placeholder="Название турнира"
            className={styles['delete-tournament-input']}
          />
          <div className={styles['modal-actions']}>
            <div className={styles['acceptOrReject-container']}>
              <button
                className={styles['acceptOrReject-btn']}
                onClick={() => {
                  if (deleteInputValue === tournamentData.title) {
                    handleDeleteTournament();
                  } else {
                    alert('Название турнира не совпадает. Пожалуйста, введите правильное название для подтверждения.');
                  }
                }}>
                Подтвердить
              </button>
              <button className={styles['acceptOrReject-btn-cancel']} onClick={() => setIsDeleteModalOpen(false)}>
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
