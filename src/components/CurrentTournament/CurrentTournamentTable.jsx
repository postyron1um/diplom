import React, { useEffect, useState } from 'react';

function CurrentTournamentTable() {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    // Загрузка данных из localStorage при монтировании компонента
    const storedTableData = JSON.parse(localStorage.getItem('tableData'));
    if (storedTableData) {
      // Сортировка данных по количеству очков
      const sortedTableData = storedTableData.slice().sort((a, b) => {
        // Сначала сравниваем количество очков, затем количество побед, затем количество ничьих
        const pointsA = a.wins * 3 + a.draws;
        const pointsB = b.wins * 3 + b.draws;
        if (pointsA !== pointsB) {
          return pointsB - pointsA; // Сортируем по убыванию количества очков
        }
        // Если количество очков одинаково, сравниваем количество забитых голов
        const goalsDifferenceA = a.goalsFor - a.goalsAgainst;
        const goalsDifferenceB = b.goalsFor - b.goalsAgainst;
        return goalsDifferenceB - goalsDifferenceA; // Сортируем по убыванию разницы забитых и пропущенных голов
      });
      setTableData(sortedTableData);
    }
  }, []);
console.log(tableData);
  return (
    <div className="currentTournamentTable">
      <table className="table">
        <thead>
          <tr>
            <th>Название</th>
            <th>О</th>
            <th>И</th>
            <th>В</th>
            <th>Н</th>
            <th>П</th>
            <th>З-П</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((player, id) => (
            <tr key={id}>
              <td>{player.name}</td>
              <td>{player.wins * 3 + player.draws}</td> {/* Отображаем сумму очков, рассчитанную по системе */}
              <td>{player.matches}</td>
              <td>{player.wins}</td>
              <td>{player.draws}</td>
              <td>{player.losses}</td>
              <td>
                {player.goalsFor}-{player.goalsAgainst} ({player.goalsFor - player.goalsAgainst})
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CurrentTournamentTable;
