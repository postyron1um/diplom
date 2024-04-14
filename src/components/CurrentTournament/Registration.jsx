import React, {useState} from 'react';

const Registration = () => {
    const [registrations, setRegistrations] = useState(JSON.parse(localStorage.getItem('tournamentParticipants')) || []);
    const [participantName, setParticipantName] = useState('');
    const [teamName, setTeamName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const participant = {
            id: Date.now(),
            name: participantName,
        };
        setRegistrations((prevRegistrations) => [...prevRegistrations, participant]);
        localStorage.setItem('tournamentParticipants', JSON.stringify([...registrations, participant]));
        setParticipantName('');
    };

    const handleCreateTeam = (e) => {
        const tournamentTeams = JSON.parse(localStorage.getItem('tournamentTeams')) || [];
        e.preventDefault();
        const team = {
            id: Date.now(),
            name: teamName,
        };
        localStorage.setItem('tournamentTeams', JSON.stringify([...tournamentTeams, team]));
        setTeamName('');
    };

    return (
        <div className="tournament-register">
            <div className="participant">
                <form onSubmit={handleSubmit}>
                    <div className="participant-row">
                        <input
                            type="text"
                            placeholder="Введите ваше имя"
                            value={participantName}
                            onChange={(e) => setParticipantName(e.target.value)}
                        />
                        <button type="submit">Зарегистрироваться как участник</button>
                    </div>
                </form>
            </div>
            <div className="register_or"> ИЛИ </div>
            <div className="teamName">
                <form onSubmit={handleCreateTeam}>
                    <div className="teamName-row">
                        <input
                            type="text"
                            placeholder="Введите название вашей команды"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                        />
                        <button type="submit">Создать команду</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Registration;