import React from 'react';

function CurrentTournamentTable({ data }) {
  return (
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
        {data.map((player, index) => (
          <tr key={index}>
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
  );
}

export default CurrentTournamentTable;
