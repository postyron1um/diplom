import React from 'react';
import styles from './Games.module.css';

function Games() {
  // Пример данных для таблицы
  const tableData = [
    { id: 1, team1: 'Команда 1', score: '3:4', team2: 'Команда 2', date: '2024-04-01' },
    { id: 2, team1: 'Команда 3', score: '2:2', team2: 'Команда 4', date: '2024-04-05' },
    // Добавьте другие объекты данных, если необходимо
  ];

  return (
    <div>
      <p className={styles['round']}>Тур 1</p>
      <div className="table-responsive">
        <table className={styles['table']}>
          <tbody>
            {tableData.map((game) => (
              <tr key={game.id}>
                <td>{game.id}</td>
                <td className={styles['col-4']}>{game.team1}</td>
                <td className={styles['col-2']}>{game.score}</td>
                <td className={styles['col-4']}>{game.team2}</td>
                <td className={styles['col-1']}>{game.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Games;
{
  /* <table className={styles['table']}>
  <tbody>
    <tr>
      <td className="col-1 text-muted text-start nowrap">1</td> <td className="col-4 text-end nowrap">ЩЁЛКОВО</td>
      <td className="col-1 text-center nowrap">
        <span className="">
          <span className="text-success">
            <b>3</b>
          </span>
          <span>:</span>
          <span className="text-danger">
            <b>0</b>
          </span>
        </span>
      </td>
      <td className="col-4 text-start nowrap">ЧЕХОВ</td>
      <td className="col-1 text-muted text-end nowrap">2024-04-07 12:00</td>
    </tr>
    <tr>
      <td className="col-1 text-muted text-start nowrap">2</td> <td className="col-4 text-end nowrap">МЫТИЩИ</td>
      <td className="col-1 text-center nowrap">
        <span className="">
          <span className="text-danger">
            <b>0</b>
          </span>
          <span>:</span>
          <span className="text-success">
            <b>3</b>
          </span>
        </span>
      </td>
      <td className="col-4 text-start nowrap">ХИМКИ</td>
      <td className="col-1 text-muted text-end nowrap">2024-04-07 13:40</td>
    </tr>
    <tr>
      <td className="col-1 text-muted text-start nowrap">3</td> <td className="col-4 text-end nowrap">НОГИНСК</td>
      <td className="col-1 text-center nowrap">
        <span className="">
          <span className="text-success">
            <b>3</b>
          </span>{' '}
          <span>:</span>{' '}
          <span className="text-danger">
            <b>1</b>
          </span>
        </span>
      </td>{' '}
      <td className="col-4 text-start nowrap">ЧЕХОВ</td>
      <td className="col-1 text-muted text-end nowrap">2024-04-07 15:00</td>
    </tr>
    <tr>
      <td className="col-1 text-muted text-start nowrap">4</td> <td className="col-4 text-end nowrap">ЩЁЛКОВО</td>
      <td className="col-1 text-center nowrap">
        <span className="">
          <span className="text-danger">
            <b>0</b>
          </span>
          <span>:</span>
          <span className="text-success">
            <b>3</b>
          </span>
        </span>
      </td>
      <td className="col-4 text-start nowrap">ХИМКИ</td>
      <td className="col-1 text-muted text-end nowrap">2024-04-07 16:20</td>
    </tr>
    <tr>
      <td className="col-1 text-muted text-start nowrap">5</td> <td className="col-4 text-end nowrap">МЫТИЩИ</td>
      <td className="col-1 text-center nowrap">
        <span className="">
          <span className="text-danger">
            <b>0</b>
          </span>
          <span>:</span>
          <span className="text-success">
            <b>3</b>
          </span>
        </span>
      </td>
      <td className="col-4 text-start nowrap">НОГИНСК</td>
      <td className="col-1 text-muted text-end nowrap">2024-04-07 16:40</td>
    </tr>
  </tbody>
</table>; */
}
