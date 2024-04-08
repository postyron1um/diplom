import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="NotFoundPage">
      Такой страницы не существует. Вы можете вернуться на <Link to="/">главную страницу</Link>
    </div>
  );
};

export default NotFoundPage;
