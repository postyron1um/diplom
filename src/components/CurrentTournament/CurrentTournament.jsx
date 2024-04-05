import React from 'react';
import CurrentTournamentHeader from './CurrentTournamentHeader';
import CurrentTournamentMenu from './CurrentTournamentMenu';
import CurrentTournamentTable from './CurrentTournamentTable';
import './CurrentTournament.scss';
function CurrentTournament() {
  const tournamentData = [
    { name: 'Мусин Тимур', goals: 12, matches: 3, wins: 4, draws: 0, losses: 0, goalsFor: 14, goalsAgainst: 5 },
    { name: 'Мусина Диана', goals: 8, matches: 3, wins: 2, draws: 2, losses: 0, goalsFor: 10, goalsAgainst: 4 },
    { name: 'Мусин Вячеслав', goals: 12, matches: 3, wins: 4, draws: 0, losses: 0, goalsFor: 11, goalsAgainst: 4 },
		
  ];

  return (
    <div className="container">
      <div className="current-tournament">
        <CurrentTournamentHeader
          title="Первенство УУНИТ по футболу среди студентов 1-3 курса."
          sportType="Теннис"
          typeTournament="Круговой"
          description="Добро пожаловать на захватывающий турнир 'Путь к славе'! Сражайтесь в эпических битвах, преодолевайте испытания и докажите свое мастерство перед миром. Отправляйтесь в захватывающее приключение в поисках величия и встречи с сильнейшими соперниками. Подготовьтесь к невероятным сражениям и величайшему испытанию вашего мастерства!"
          startDate="04.04.2024"
          endDate="13.06.2024"
        />
        <CurrentTournamentMenu />
        <CurrentTournamentTable data={tournamentData} />
      </div>
    </div>
  );
}

export default CurrentTournament;
