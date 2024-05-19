import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from '../../../utils/axios';
import { updateTournament } from '../../../redux/features/tournament/tournamentSlice';
import styles from './AdminPanel.module.scss';
import formatDate from '../../../Func/DateFormat';

function EditTournament({ tournamentId }) {
  const dispatch = useDispatch();
  const [tournamentData, setTournamentData] = useState({
    title: '',
    sportType: '',
    typeTournament: '',
    tournamentDesc: '',
    startDate: '',
    endDate: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);
  console.log(tournamentData);
  useEffect(() => {
    if (tournamentId) {
      axios
        .get(`/tournaments/${tournamentId}`)
        .then((response) => {
          const tournament = response.data.tournament[0];
          console.log('Tournament data fetched:', tournament);
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
  }, [tournamentId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTournamentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditTournament = async () => {
    try {
      await dispatch(updateTournament({ tournamentId, ...tournamentData }));
      setIsEditMode(false);
      alert('Турнир успешно обновлен');
    } catch (error) {
      console.error('Ошибка при редактировании турнира:', error);
      alert('Ошибка при редактировании турнира');
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <div className={styles['edit-tournament']}>
      <h2 className={styles['edit-title']}>Редактирование турнира</h2>
      {isEditMode ? (
        <div>
          <div className={styles['form-group']}>
            <label className={styles['form-label']}>Название турнира</label>
            <input
              className={styles['edit-input']}
              type="text"
              name="title"
              value={tournamentData.title}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles['form-group']}>
            <label className={styles['form-label']}>Тип спорта</label>
            <input
              className={styles['edit-input']}
              type="text"
              name="sportType"
              value={tournamentData.sportType}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles['form-group']}>
            <label className={styles['form-label']}>Тип турнира</label>
            <input
              className={styles['edit-input']}
              type="text"
              name="typeTournament"
              value={tournamentData.typeTournament}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles['form-group']}>
            <label className={styles['form-label']}>Описание турнира</label>
            <textarea
              className={styles['edit-input']}
              name="tournamentDesc"
              value={tournamentData.tournamentDesc}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles['date-flex']}>
            <div className={styles['form-group']}>
              <label className={styles['form-label']}>Дата начала</label>
              <input
                className={styles['edit-input']}
                type="date"
                name="startDate"
                value={formatDate(tournamentData.startDate)}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles['form-group']}>
              <label className={styles['form-label']}>Дата окончания</label>
              <input
                className={styles['edit-input']}
                type="date"
                name="endDate"
                value={formatDate(tournamentData.endDate)}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className={styles['btn-flex']	}>
            <button onClick={handleEditTournament}>Сохранить изменения</button>
            <button onClick={toggleEditMode}>Отмена</button>
          </div>
        </div>
      ) : (
        <div>
          <div className={styles['form-group']}>
            <label className={styles['form-label']}>Название турнира</label>
            <p className={styles['edit-input']}>{tournamentData.title}</p>
          </div>
          <div className={styles['form-group']}>
            <label className={styles['form-label']}>Тип спорта</label>
            <p className={styles['edit-input']}>{tournamentData.sportType}</p>
          </div>
          <div className={styles['form-group']}>
            <label className={styles['form-label']}>Тип турнира</label>
            <p className={styles['edit-input']}>{tournamentData.typeTournament}</p>
          </div>
          <div className={styles['form-group']}>
            <label className={styles['form-label']}>Описание турнира</label>
            <p className={styles['edit-input']}>{tournamentData.tournamentDesc}</p>
          </div>
          <div className={styles['date-flex']}>
            <div className={styles['form-group']}>
              <label className={styles['form-label']}>Дата начала</label>
              <p className={styles['edit-input']}>{formatDate(tournamentData.startDate)}</p>
            </div>
            <div className={styles['form-group']}>
              <label className={styles['form-label']}>Дата окончания</label>
              <p className={styles['edit-input']}>{formatDate(tournamentData.endDate)}</p>
            </div>
          </div>

          <button className={styles['edit-btn']} onClick={toggleEditMode}>Редактировать</button>
        </div>
      )}
    </div>
  );
}

export default EditTournament;
