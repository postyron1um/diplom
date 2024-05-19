import SelectInput from './SelectInput/SelectInput';
import TypeTournament from './TypeTournament/TypeTournament';
import TournamentDesc from './TournamentDesc/TournamentDesc';
import TournamentName from './TournamentName/TournamentName';
import DateInput from './DateInput/DateInput';
import Button from '../Button/Button';

import { useDispatch, useSelector } from 'react-redux';
import './CreateTournament.scss';
import cn from 'classnames';
import { useEffect, useReducer, useState } from 'react';
import { initialState, reducer, sportTypeOptions } from './CreateTournament.state';
import { useNavigate } from 'react-router-dom';
import { createTournament } from '../../redux/features/tournament/tournamentSlice';
import { toast } from 'react-toastify';
import extractUserRoleFromToken from '../../Func/extractUserDetailsFromToken';

function CreateTournament() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { title, sportType, errors, typeTournament, tournamentDesc, startDate, endDate } = state;
  const [createdAt, setCreatedAt] = useState(null);
  const navigate = useNavigate();
  const Dispatch = useDispatch();
  const { status } = useSelector((state) => state.tournament);
  const userToken = localStorage.getItem('token');
  const role = extractUserRoleFromToken(userToken, 'roles');

  const isAdmin = Array.isArray(role) && role.includes('ADMIN');

  useEffect(() => {
    if (status) {
      toast(status);
    }
  }, [status]);

  const handleFieldChange = (field, value) => {
    dispatch({ type: 'SET_FIELD', field, value });
    if (value.trim() === '') {
      dispatch({
        type: 'SET_ERROR',
        field,
        message: `Пожалуйста, введите ${field === 'title' ? 'название турнира' : ''}`,
      });
      setTimeout(() => {
        dispatch({ type: 'CLEAR_ERROR', field });
      }, 2000);
    } else {
      dispatch({ type: 'CLEAR_ERROR', field });
    }
    if (field === 'sportType') {
      if (value === 'Другое') {
        dispatch({ type: 'SET_ERROR', field: 'sportType', message: 'Пожалуйста, выберите вид спорта' });
      } else {
        dispatch({ type: 'CLEAR_ERROR', field: 'sportType' });
      }
    }
    if (field === 'typeTournament' || field === 'tournamentDesc' || field === 'startDate' || field === 'endDate') {
      if (value.trim() !== '') {
        dispatch({ type: 'CLEAR_ERROR', field });
      }
    }
    if (field === 'startDate' || field === 'endDate') {
      const startDateValue = field === 'startDate' ? value : startDate;
      const endDateValue = field === 'endDate' ? value : endDate;

      if (startDateValue && endDateValue) {
        // Проверяем, есть ли значения для обеих дат
        const startDateObj = new Date(startDateValue);
        const endDateObj = new Date(endDateValue);

        if (startDateObj > endDateObj) {
          dispatch({ type: 'SET_ERROR', field: 'startDate', message: 'Дата начала не может быть позже даты окончания' });
        } else {
          dispatch({ type: 'CLEAR_ERROR', field: 'startDate' });
          dispatch({ type: 'CLEAR_ERROR', field: 'endDate' });
        }
      } else if (startDateValue) {
        // Если значение endDate отсутствует, но есть значение startDate
        dispatch({ type: 'CLEAR_ERROR', field: 'startDate' });
      } else if (endDateValue) {
        // Если значение startDate отсутствует, но есть значение endDate
        dispatch({ type: 'CLEAR_ERROR', field: 'endDate' });
      } else {
        // Если значения обеих дат отсутствуют, не выполняем никаких действий
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let formIsValid = true;
    if (!title.trim()) {
      dispatch({ type: 'SET_ERROR', field: 'title', message: 'Пожалуйста, введите название турнира' });
      formIsValid = false;
    }
    if (sportType === 'Другое') {
      dispatch({ type: 'SET_ERROR', field: 'sportType', message: 'Пожалуйста, выберите вид спорта' });
      formIsValid = false;
    }
    if (!tournamentDesc.trim()) {
      dispatch({ type: 'SET_ERROR', field: 'tournamentDesc', message: 'Пожалуйста, дайте описание турнира' });
      formIsValid = false;
    }
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    if (startDateObj > endDateObj) {
      dispatch({ type: 'SET_ERROR', field: 'startDate', message: 'Дата начала не может быть позже даты окончания' });
      formIsValid = false;
    }
    if (!startDate) {
      dispatch({ type: 'SET_ERROR', field: 'startDate', message: 'Пожалуйста, введите соответствующие даты для турнира' });
      formIsValid = false;
    }
    if (!endDate) {
      dispatch({ type: 'SET_ERROR', field: 'endDate', message: 'Пожалуйста, введите соответствующие даты для турнира' });
      formIsValid = false;
    }
    if (!formIsValid) {
      return;
    }

    const currentDate = new Date(); // Текущая дата и время
    const createdAt = currentDate.toISOString();
    const newTournament = {
      title,
      sportType,
      typeTournament,
      tournamentDesc,
      startDate,
      endDate,
      createdAt, // Добавляем поле createdAt
    };
    setCreatedAt(createdAt);
    // Вызываем функцию для добавления турнира

    handleAddTournament(newTournament);

    if (!formIsValid) {
      return;
    }
    dispatch({ type: 'RESET_FORM' }); // Сброс формы после отправки

    try {
      Dispatch(createTournament(newTournament));
    } catch (error) {
      console.log(error);
    }

    // navigate('/alltournaments');
  };

  const handleAddTournament = (newTournament) => {
    // setTournaments([...tournaments, { ...newTournament, id: tournaments.length + 1, createdAt: new Date() }]);
    let tournaments = JSON.parse(localStorage.getItem('tournaments'));

    if (!tournaments) {
      localStorage.setItem('tournaments', JSON.stringify([newTournament]));
    } else {
      tournaments.push(newTournament);
      localStorage.setItem('tournaments', JSON.stringify(tournaments));
    }
  };

  return (
    <div className="container createTournament__container">
      {isAdmin ? (
        <div className="createTournament">
          <h1 className="createTournament__title">Создание турнира</h1>
          <form onSubmit={handleSubmit}>
            <TournamentName
              className={cn('tournamentName', { invalid: errors.title })}
              name="title"
              label="Название:"
              maxLength="100"
              value={title}
              onChange={(value) => handleFieldChange('title', value)} // Используем общую функцию для изменения поля
            />
            {errors.title && <div className="error-message">Ошибка: {errors.title}</div>}
            <SelectInput
              className={cn('createTournament__select', { invalid: errors.sportType })}
              name="sportType"
              label="Вид спорта:"
              options={sportTypeOptions}
              value={sportType}
              onChange={(value) => handleFieldChange('sportType', value)} // Используем общую функцию для изменения поля
            />
            {errors.sportType && <div className="error-message">Ошибка: {errors.sportType}</div>}
            <TypeTournament
              name="typeTournament"
              label="Тип турнира:"
              options={['Круговой', 'На вылет']}
              defaultValue={typeTournament} // Установка "Круговой" по умолчанию
              onChange={(value) => handleFieldChange('typeTournament', value)}
            />
            <TournamentDesc
              className={cn('createTournament__select', { invalid: errors.tournamentDesc })}
              name="tournamentDesc"
              label="Описание:"
              maxLength="2000"
              value={tournamentDesc} // Добавьте это
              onChange={(value) => handleFieldChange('tournamentDesc', value)}
            />
            {errors.tournamentDesc && <div className="error-message">Ошибка: {errors.tournamentDesc} </div>}
            <div className="form-group__container">
              <DateInput
                className={cn('datepicker', { invalid: errors.startDate })}
                id="startDate"
                value={startDate}
                onChange={(value) => handleFieldChange('startDate', value)}>
                Дата начала
              </DateInput>
              <DateInput
                appearance="endDate"
                minDate={startDate}
                className={cn('datepicker', { invalid: errors.endDate })}
                id="endDate"
                value={endDate}
                onChange={(value) => handleFieldChange('endDate', value)}>
                Дата окончания
              </DateInput>
            </div>
            {errors.startDate && <div className="error-message error-message__date-input">Ошибка: {errors.startDate}</div>}
            <div className="form-group btn-container">
              <Button type="submit">Создать</Button>
              <Button onClick={() => window.history.go(-1)}>Отменить</Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="no-access-create">У вас нет доступа к этой странице.</div>
      )}
    </div>
  );
}
export default CreateTournament;
