import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import './Signup.scss';
import { useDispatch, useSelector } from 'react-redux';
import { checkIsAuth, logout } from '../../../redux/features/auth/authSlice';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import Modal from './../../Modal/Modal'; // Импортируем компонент модального окна
import extractUserUsernameFromToken from '../../../Func/extractUserDetailsFromToken';

function Signup() {
  const userToken = localStorage.getItem('token');
  const isAuth = useSelector(checkIsAuth);
	console.log(isAuth);
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);
  const logoutHandler = () => {
    setShowModal(true); // Показываем модальное окно при нажатии на кнопку выхода
  };
  const userId = extractUserUsernameFromToken(userToken, 'id');
  console.log(userId);


  // Создаем состояние для отображения/скрытия модального окна
  const [showModal, setShowModal] = useState(false);

  // Функция для выхода из аккаунта
  const confirmLogout = () => {
    dispatch(logout());
    window.localStorage.removeItem('token');
    toast('Вы вышли из системы');
    setShowModal(false); // Закрываем модальное окно после выхода
  };
  const [isExpanded, setIsExpanded] = useState(false);


 const fetchUserData = async (userId) => {
   try {
     const response = await fetch(`http://localhost:3007/api/users/${userId}`);
     if (!response.ok) {
       throw new Error('Ошибка получения данных о пользователе');
     }
     const userData = await response.json();
     setUserData(userData); // Сохраняем данные о пользователе в состоянии
   } catch (error) {
     console.error('Ошибка при получении данных о пользователе:', error);
   }
 };
  useEffect(() => {
    const userId = extractUserUsernameFromToken(userToken, 'id');
    if (userId) {
      fetchUserData(userId); // Вызываем функцию для получения данных о пользователе при монтировании компонента
    }
  }, [userToken]);

  return (
    <>
      {!isAuth ? (
        <div className="signup">
          <NavLink className={({ isActive }) => (isActive ? 'nav_active' : 'pending')} to="/registration">
            Регистрация
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'nav_active' : 'pending')} to="/login">
            Вход
          </NavLink>
        </div>
      ) : (
        <div className="signup">
          <div className="username-container" onClick={() => setIsExpanded(!isExpanded)}>
            {userData ? `${userData.lastName} ${userData.firstName}` : 'Загрузка...'}
            {isExpanded && (
              <button className="signup-btn-logout" onClick={logoutHandler}>
                Выйти с аккаунта
              </button>
            )}
          </div>
          {showModal && (
            <Modal onClose={() => setShowModal(false)}>
              <div>Вы уверены, что хотите выйти из аккаунта?</div>
              <div className="logout-modal-container">
                <button className="yes_logout" onClick={confirmLogout}>
                  Да
                </button>
                <button className="modal-cancell" onClick={() => setShowModal(false)}>
                  Отмена
                </button>
              </div>
            </Modal>
          )}
        </div>
      )}
    </>
  );
}

export default Signup;

// import { NavLink } from 'react-router-dom';
// import { useState } from 'react'; // Импортируем useState для работы со состоянием
// import './Signup.scss';
// import { useDispatch, useSelector } from 'react-redux';
// import { checkIsAuth, logout } from '../../../redux/features/auth/authSlice';
// import { toast } from 'react-toastify';
// import { useEffect } from 'react';

// function Signup() {
//   const userToken = localStorage.getItem('token');
//   const isAuth = useSelector(checkIsAuth);
//   const dispatch = useDispatch();
//   const logoutHandler = () => {
//     dispatch(logout());
//     window.localStorage.removeItem('token');
//     toast('Вы вышли из системы');
//   };

//   const extractUserUsernameFromToken = (token) => {
//     try {
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       return payload.username;
//     } catch (error) {
//       console.error('Ошибка при извлечении ID пользователя из токена:', error);
//       return null;
//     }
//   };

//   const username = extractUserUsernameFromToken(userToken);

//   // Создаем состояние для отображения/скрытия контента
//   const [isExpanded, setIsExpanded] = useState(false);

//   return (
//     <>
//       {!isAuth ? (
//         <div className="signup">
//           <NavLink className={({ isActive }) => (isActive ? 'nav_active' : 'pending')} to="/registration">
//             Регистрация
//           </NavLink>
//           <NavLink className={({ isActive }) => (isActive ? 'nav_active' : 'pending')} to="/login">
//             Вход
//           </NavLink>
//         </div>
//       ) : (
//         <div className="signup">
//           <div className="username-container" onClick={() => setIsExpanded(!isExpanded)}>
//             <span className="username">{username}</span>
//             {isExpanded && (
//               <button className="signup-btn-logout" onClick={logoutHandler}>
//                 Выйти с аккаунта
//               </button>
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default Signup;
