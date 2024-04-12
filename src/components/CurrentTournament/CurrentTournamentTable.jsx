import React, { useEffect, useState } from 'react';

function CurrentTournamentTable() {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    // Загрузка данных из localStorage при монтировании компонента
    const storedTableData = JSON.parse(localStorage.getItem('tableData'));
    if (storedTableData) {
      setTableData(storedTableData);
    }
  }, []);

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
              <td>{player.goals}</td>
              <td>{player.matches}</td>
              <td>{player.wins}</td>
              <td>{player.draws}</td>
              <td>{player.losses}</td>
              <td>
                {player.goalsFor}-{player.goalsAgainst}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CurrentTournamentTable;
