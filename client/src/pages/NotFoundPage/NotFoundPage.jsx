import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="NotFoundPage">
      Такой страницы не существует. Вы можете вернуться на 
      <span className="NotFoundPage-span">
        <Link to="/"> главную страницу</Link>
      </span>
    </div>
  );
};

export default NotFoundPage;
