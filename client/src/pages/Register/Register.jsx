import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { registerUser } from '../../redux/features/auth/authSlice';
import { toast } from 'react-toastify';

import styles from './Register.module.scss';
function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { status } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (status) {
      toast(status);
    }
  }, [status]);
  const handleSubmit = () => {
    console.log(username, password);
    try {
      dispatch(registerUser({ username, password }));
      setPassword('');
      setUsername('');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container">
      <div className={styles['registration']}>
        <form onSubmit={(e) => e.preventDefault()} className={styles['registration-form']}>
          <span className={styles['registration-title']}>Регистрация</span>
          <div className={styles['wrap-input']}>
            <input
              id="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Username"
              className={styles['registration-input']}
            />
          </div>
          <div className={styles['wrap-input']}>
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type='password'
              placeholder="Password"
              className="mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none placeholder:text-gray-700"
            />
          </div>

          {/* <div className={styles['wrap-input']}>
            <input placeholder="Фамилия" className={styles['registration-input']} type="text" name="" id="" />
          </div>
          <div className={styles['wrap-input']}>
            <input placeholder="Имя" className={styles['registration-input']} type="text" name="" id="" />
          </div>
          <div className={styles['wrap-input']}>
            <input placeholder="Email" className={styles['registration-input']} type="email" name="" id="" />
          </div>
          <div className={styles['wrap-input']}>
            <input placeholder="Придумайте пароль" className={styles['registration-input']} type="password" name="" id="" />
          </div>
          <div className={styles['wrap-input']}>
            <input placeholder="Подтвердите пароль" className={styles['registration-input']} type="password" name="" id="" />
          </div> */}
          <div className={styles['have-account-or-register']}>
            <button onClick={handleSubmit} className={styles['registration-form__btn']}>
              Зарегистрироваться
            </button>
            <div className={styles['have-account-align']}>
              <Link to="/login">
                <span className={styles['have-account']}>Уже зарегистрированы?</span>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
