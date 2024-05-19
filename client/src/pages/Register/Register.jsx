import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { checkIsAuth, registerUser } from '../../redux/features/auth/authSlice';
import { toast } from 'react-toastify';
import useFormReducer from './Register.state';

import styles from './Register.module.scss';

function Register() {
  const { state, setFieldValue, setFieldError } = useFormReducer();
  const { firstName, lastName, email, tel, password, errors } = state;
  const { status } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector(checkIsAuth);
  useEffect(() => {
    if (status) {
      toast(status);
    }
    if (isAuth) navigate('/main');
  }, [status]);

  const validateInputs = () => {
    let isValid = true;

    // Проверка имени
    if (!firstName.trim() || firstName.trim().length < 3) {
      setFieldError('firstName', 'Имя должно содержать минимум 3 символа');
      isValid = false;
    } else {
      setFieldError('firstName', '');
    }

    // Проверка фамилии
    if (!lastName.trim() || lastName.trim().length < 3) {
      setFieldError('lastName', 'Фамилия должна содержать минимум 3 символа');
      isValid = false;
    } else {
      setFieldError('lastName', '');
    }

    // Проверка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setFieldError('email', 'Введите корректный email');
      isValid = false;
    } else {
      setFieldError('email', '');
    }

    // Проверка номера телефона
const tel = '+7 996 106-92-83'; // Пример номера телефона с пробелами и дефисами
const telRegex = /^(\+7|8)[\s-]?\d{3}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;


if (!tel.trim() || !telRegex.test(tel)) {
  setFieldError('tel', 'Введите корректный номер телефона');
  isValid = false;
} else {
  setFieldError('tel', '');
}

    // Проверка пароля
    if (password.length < 6) {
      setFieldError('password', 'Пароль должен содержать минимум 6 символов');
      isValid = false;
    } else {
      setFieldError('password', '');
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    console.log('dfsd');
    e.preventDefault();
    if (validateInputs()) {
      try {
        dispatch(registerUser({ firstName, lastName, email, tel, password }));
        // Сброс значений после отправки формы
        // setFieldValue('firstName', '');
        // setFieldValue('lastName', '');
        // setFieldValue('email', '');
        // setFieldValue('tel', '');
        // setFieldValue('password', '');
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="container">
      <div className={styles['registration']}>
        <form onSubmit={handleSubmit} className={styles['form']}>
          <p className={styles['title']}>Регистрация </p>

          <div className={styles['flex']}>
            <label>
              <input
                value={firstName}
                onChange={(e) => setFieldValue('firstName', e.target.value)}
                className={styles['input']}
                type="text"
                placeholder=""
                required=""
              />
              <span>Имя</span>
              {errors.firstName && <span className={styles['error-message']}>{errors.firstName}</span>}
            </label>
            <label>
              <input
                value={lastName}
                onChange={(e) => setFieldValue('lastName', e.target.value)}
                className={styles['input']}
                type="text"
                placeholder=""
                required=""
              />
              <span>Фамилия</span>
              {errors.lastName && <span className={styles['error-message']}>{errors.lastName}</span>}
            </label>
          </div>
          <label>
            <input
              value={tel}
              onChange={(e) => setFieldValue('tel', e.target.value)}
              className={styles['input']}
              type="tel"
              placeholder=""
              required=""
            />
            <span>Номер телефона</span>
            {errors.tel && <span className={styles['error-message']}>{errors.tel}</span>}
          </label>

          <label>
            <input
              value={email}
              onChange={(e) => setFieldValue('email', e.target.value)}
              className={styles['input']}
              type="email"
              placeholder=""
              required=""
            />
            <span>Email</span>
          {errors.email && <span className={styles['error-message']}>{errors.email}</span>}
          </label>
          <label>
            <input
              value={password}
              onChange={(e) => setFieldValue('password', e.target.value)}
              className={styles['input']}
              type="password"
              placeholder=""
              required=""
            />
            <span>Пароль</span>
          {errors.password && <span className={styles['error-message']}>{errors.password}</span>}
          </label>

          <label>
            <input className={styles['input']} type="password" placeholder="" required="" />
            <span>Подтвердить пароль</span>
          {errors.password && <span className={styles['error-message']}>{errors.password}</span>}
          </label>
          <button type="submit" className={styles['submit']}>
            Зарегистрироваться
          </button>
          <p className={styles['signin']}>
            Уже зарегистрированы? <Link to="/login">Войти</Link>
          </p>
        </form>
        {/* <form onSubmit={handleSubmit} className={styles['registration-form']}>
          <span className={styles['registration-title']}>Регистрация</span>
          <div className={styles['wrap-input']}>
            <input
              id="FirstName"
              value={firstName}
              onChange={(e) => setFieldValue('firstName', e.target.value)}
              type="text"
              placeholder="Фамилия"
              className={styles['registration-input']}
            />
            {errors.firstName && <span className={styles['error-message']}>{errors.firstName}</span>}
          </div>
          <div className={styles['wrap-input']}>
            <input
              id="LastName"
              value={lastName}
              onChange={(e) => setFieldValue('lastName', e.target.value)}
              type="text"
              placeholder="Имя"
              className={styles['registration-input']}
            />
          {errors.lastName && <span className={styles['error-message']}>{errors.lastName}</span>}
          </div>
          <div className={styles['wrap-input']}>
            <input
              id="Tel"
              value={tel}
              onChange={(e) => setFieldValue('tel', e.target.value)}
              type="tel"
              placeholder="Номер телефона"
              className={styles['registration-input']}
            />
          {errors.tel && <span className={styles['error-message']}>{errors.email}</span>}
          </div>
          <div className={styles['wrap-input']}>
            <input
              id="Email"
              value={email}
              onChange={(e) => setFieldValue('email', e.target.value)}
              type="Username"
              placeholder="Email"
              className={styles['registration-input']}
            />
          {errors.email && <span className={styles['error-message']}>{errors.email}</span>}
          </div>
          <div className={styles['wrap-input']}>
            <input
              id="password"
              value={password}
              onChange={(e) => setFieldValue('password', e.target.value)}
              type="password"
              placeholder="Пароль"
              className="mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none placeholder:text-gray-700"
            />
          {errors.password && <span className={styles['error-message']}>{errors.password}</span>}
          </div>

          <button type="submit" className={styles['registration-form__btn']}>
            Зарегистрироваться
          </button>
          <div className={styles['have-account-or-register']}>
            <Link to="/login">
              <span className={styles['have-account']}>Уже зарегистрированы?</span>
            </Link>
          </div>
        </form> */}
      </div>
    </div>
  );
}

export default Register;
