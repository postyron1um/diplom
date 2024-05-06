import Match from "../models/Knockout.js";
import Player from "../models/Player.js";
import Tournament from "../models/Tournament.js";
import Participant from "../models/Participant.js";

// Создание нового матча
export const createMatch = async (req, res) => {
  try {
    const { tournamentId, round, team1, team2, score1, score2, date } =
      req.body;

    // Проверяем, начат ли турнир
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament.isStarted) {
      // Получаем ObjectId участников команд
<<<<<<< HEAD
      const team1Participant = await Participant.findOne({ username: team1, tournament: tournamentId });
      const team2Participant = await Participant.findOne({ username: team2, tournament: tournamentId });
      console.log('RTRTRT', team1Participant);
=======
      const team1Participant = await Participant.findOne({
        username: team1,
        tournament: tournamentId,
      });
      const team2Participant = await Participant.findOne({
        username: team2,
        tournament: tournamentId,
      });
      console.log("RTRTRT", team1Participant);
>>>>>>> b95348de86aa707cb2930ef48bda26a52af3f3c7

      // Теперь создаем матч, передавая ObjectId участников команд
      const newMatch = new Match({
        tournamentId,
        round,
        team1: team1Participant.username,
        team2: team2Participant.username,
        score1,
        score2,
        date,
      });
      console.log(newMatch);

      await newMatch.save();

      // Создаем новых игроков и связываем их с текущим турниром
      const team1Player = new Player({
        participant: team1Participant._id,
        tournamentId,
        username: team1Participant.username,
      });
      const team2Player = new Player({
        participant: team2Participant._id,
        tournamentId,
        username: team2Participant.username,
      });

      // Сохраняем новых игроков
      await team1Player.save();
      await team2Player.save();

      // Обновляем список матчей турнира в базе данных tournaments
      tournament.matches.push(newMatch._id);
      await tournament.save();

      res
        .status(201)
        .json({
          success: true,
          match: newMatch,
          message: "🏆 Турнир успешно начат! 🚀",
        });
    } else {
      // Турнир уже начат, не разрешаем создание новых матчей
      res
        .status(403)
        .json({
          success: false,
          message: "Турнир уже начат. Создание новых матчей запрещено.",
        });
    }
  } catch (error) {
    console.error("Ошибка при создании матча:", error);
    res
      .status(500)
      .json({ success: false, message: "Ошибка при создании матча." });
  }
};
// Получение всех матчей
export const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find();
    res.json({ success: true, matches });
  } catch (error) {
    console.error("Ошибка при получении всех матчей:", error);
    res
      .status(500)
      .json({ success: false, message: "Ошибка при получении всех матчей." });
  }
};

export const updateMatch = async (req, res) => {
  try {
    const { matchId } = req.body;
    const { score1, score2 } = req.body;
    // Находим матч по его ID и обновляем его данные
    const updatedMatch = await Match.findByIdAndUpdate(
      matchId,
      { score1, score2 },
      { new: true }
    );
    res.json({ success: true, match: updatedMatch });
  } catch (error) {
    console.error("Ошибка при обновлении матча:", error);
    res
      .status(500)
      .json({ success: false, message: "Ошибка при обновлении матча." });
  }
};

<<<<<<< HEAD
=======
export const updatedMatchResultTimur = async (req, res) => {
  try {
    // const { tournamentId } = req.params;
    // console.log(tournamentId, 'fdfdfdfd')
    const { matchId, score1, score2,tournamentId } = req.body;
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: "Матч не найден" });
    }

    const previousScore1 = match.previousScore1 || 0;
    const previousScore2 = match.previousScore2 || 0;
    if (score1 === previousScore1 && score2 === previousScore2 && (score1 !== 0 || score2 !== 0)) {
      return res
        .status(200)
        .json({ message: "Результаты матча не изменились" });
    }

    match.previousScore1 = match.score1;
    match.previousScore2 = match.score2;
    match.score1 = score1;
    match.score2 = score2;
    await match.save();

    const team1User = await Participant.findOne({username: match.team1, tournament: tournamentId})
    const team2User = await Participant.findOne({username: match.team2, tournament: tournamentId})
    if (!team1User || !team2User){
      return res.status(404).json({message:'Участники не найдены'}); 
    }

    const player1 = await Player.findOneAndUpdate(
      { participant: team1User._id },
      { matches: 1 },
      { upsert: true, new: true }
    );
    const player2 = await Player.findOneAndUpdate(
      { participant: team2User._id },
      { matches: 1 },
      { upsert: true, new: true }
    );

    if (score1 > score2 && previousScore1 <= previousScore2){
      player1.wins += 1;
      if (player1.losses > 0){
        player1.losses -= 1;
      }
      player2.losses += 1;
      if (player2.wins > 0){
        player2.wins -= 1;
      }
    }

    if (score1 < score2 && previousScore1 >= previousScore2){
      player2.wins += 1;
      if(player2.losses > 0){
        player2.losses -= 1;
      }
      player1.losses += 1;
      if (player1.wins > 0) {
        player1.wins -= 1;
      }
    }


    if (score1 === score2 && previousScore1 === 0 && previousScore2 === 0 && match.isFirstZeroZeroEdit){
      // Это первое редактирование и счет равен 0:0
      player1.draws += 1;
      player2.draws += 1;
      match.isFirstZeroZeroEdit = false;
      await match.save();
  } else if (score1 === score2 && previousScore1 !== previousScore2) {
      // Это не первое редактирование, и счет равен 0:0
      player1.draws += 1;
      player2.draws += 1;
      if(player2.wins > 0){
          player2.wins -= 1;
      }
      if(player1.wins > 0){
          player1.wins -= 1;
      }
  
      if(player2.losses > 0){
          player2.losses -= 1;
      }
      if(player1.losses > 0){
          player1.losses -= 1;
      }
  }

  if (score1 !== score2 && previousScore1 === previousScore2) {
    // Это первое редактирование, и счет больше не равен 0:0
    if(player1.draws > 0 ) {
      player1.draws -= 1;
    }
    if(player2.draws > 0 ) {
      player2.draws -= 1;
    }

    // match.isFirstZeroZeroEdit = false;
    // await match.save();
  }

    let goalsForChange1 = score1 - previousScore1;
    let goalsAgainstChange1 = score2 - previousScore2;
    let goalsForChange2 = score2 - previousScore2;
    let goalsAgainstChange2 = score1 - previousScore1;

    if (score1 === score2) {
      // При ничье вычитаем голы из предыдущего редактирования
      goalsForChange1 -= match.goalsForChange1 || 0;
      goalsAgainstChange1 -= match.goalsAgainstChange1 || 0;
      goalsForChange2 -= match.goalsForChange2 || 0;
      goalsAgainstChange2 -= match.goalsAgainstChange2 || 0;

      // Обнуляем предыдущие изменения в голах
      match.goalsForChange1 = 0;
      match.goalsAgainstChange1 = 0;
      match.goalsForChange2 = 0;
      match.goalsAgainstChange2 = 0;
    } else {
      // Обновляем изменения в голах в матче
      match.goalsForChange1 = goalsForChange1;
      match.goalsAgainstChange1 = goalsAgainstChange1;
      match.goalsForChange2 = goalsForChange2;
      match.goalsAgainstChange2 = goalsAgainstChange2;
    }

    // Обновляем забитые и пропущенные голы
    player1.goalsFor += goalsForChange1;
    player1.goalsAgainst += goalsAgainstChange1;
    player2.goalsFor += goalsForChange2;
    player2.goalsAgainst += goalsAgainstChange2;

    await player1.save();
    await player2.save();

    return res.status(200).json({ message: "Результаты матча успешно обновлены" });
  } catch (error) {
    console.error("Ошибка при обновлении результатов матча:", error);
    return res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
};

>>>>>>> b95348de86aa707cb2930ef48bda26a52af3f3c7
export const updateMatchResult = async (req, res) => {
  try {
    const { matchId, score1, score2 } = req.body;
    // Находим матч по его идентификатору
    const match = await Match.findById(matchId);
    // Проверяем, существует ли матч
    if (!match) {
      return res.status(404).json({ message: "Матч не найден" });
    }

    // Получаем предыдущие результаты матча перед его обновлением
    const previousScore1 = match.previousScore1 || 0;
    const previousScore2 = match.previousScore2 || 0;
<<<<<<< HEAD

    if (score1 === previousScore1 && score2 === previousScore2 && (score1 !== 0 || score2 !== 0)) {
      return res.status(200).json({ message: 'Результаты матча не изменились' });
=======
    // Добавляем проверку, чтобы не блокировать выполнение кода, если новые результаты не равны нулю,
    // даже если предыдущие результаты были нулевыми
    if (
      score1 === previousScore1 &&
      score2 === previousScore2 &&
      (score1 !== 0 || score2 !== 0)
    ) {
      return res
        .status(200)
        .json({ message: "Результаты матча не изменились" });
>>>>>>> b95348de86aa707cb2930ef48bda26a52af3f3c7
    }

    // Сохраняем предыдущие результаты матча
    match.previousScore1 = match.score1;
    match.previousScore2 = match.score2;
    // Обновляем результаты матча
    match.score1 = score1;
    match.score2 = score2;
    // Сохраняем обновленный матч
    await match.save();
    // Проверяем, изменились ли результаты матча
    if (score1 !== previousScore1 || score2 !== previousScore2) {
      // Получаем команды, участвующие в матче
      const team1User = await Participant.findOne({ username: match.team1 });
      const team2User = await Participant.findOne({ username: match.team2 });
      if (!team1User || !team2User) {
        return res.status(404).json({ message: "Пользователи не найдены" });
      }
      // Обновляем данные игроков
      const player1 = await Player.findOneAndUpdate(
        { participant: team1User._id },
        { matches: 1 },
        { upsert: true, new: true }
      );
      const player2 = await Player.findOneAndUpdate(
        { participant: team2User._id },
        { matches: 1 },
        { upsert: true, new: true }
      );

      if (score1 > score2 && previousScore1 <= previousScore2) {
        player1.wins += 1;
        player2.losses += 1;

				player1.losses -= 1
				player2.wins -=1
      }
			if (score1 < score2 && previousScore1 >= previousScore2) {
        player2.wins += 1;
        player1.losses += 1;
			}












      // Рассчитываем изменения в данных игроков
      let winsChange1 = 0;
      let winsChange2 = 0;
      let lossesChange1 = 0;
      let lossesChange2 = 0;

      if (score1 > score2 && previousScore1 <= previousScore2) {
        winsChange1 = 1;
        lossesChange2 = 1;
      } else if (score1 < score2 && previousScore1 >= previousScore2) {
        winsChange2 = 1;
        lossesChange1 = 1;
      } else {
        // Добавим обработку случая, когда результаты не меняются
        winsChange1 = 0;
        winsChange2 = 0;
        lossesChange1 = 0;
        lossesChange2 = 0;
      }

      // Обновляем данные игроков с учетом изменений
      // Если результат стал ничьей и это первое редактирование матча
      if (score1 === score2 && previousScore1 === 0 && previousScore2 === 0) {
        // Устанавливаем новый результат ничьей
        player1.draws += 1;
        player2.draws += 1;
      } else if (score1 === score2 && previousScore1 !== previousScore2) {
        // Если это не первое редактирование матча и результат всё ещё ничейный,
        // не изменяем счет ничьих, если предыдущие результаты были ничьей
      } else {
        // Если результат не ничья
        player1.wins = Math.max(player1.wins + winsChange1, 0);
        player2.wins = Math.max(player2.wins + winsChange2, 0);
        player1.losses = Math.max(player1.losses + lossesChange1, 0);
        player2.losses = Math.max(player2.losses + lossesChange2, 0);
      }

      // Вычисляем изменения в забитых и пропущенных голах
      let goalsForChange1 = score1 - previousScore1;
      let goalsAgainstChange1 = score2 - previousScore2;
      let goalsForChange2 = score2 - previousScore2;
      let goalsAgainstChange2 = score1 - previousScore1;

      // Если результат стал ничьей
      if (score1 === score2) {
        // При ничье вычитаем голы из предыдущего редактирования
        goalsForChange1 -= match.goalsForChange1 || 0;
        goalsAgainstChange1 -= match.goalsAgainstChange1 || 0;
        goalsForChange2 -= match.goalsForChange2 || 0;
        goalsAgainstChange2 -= match.goalsAgainstChange2 || 0;

        // Обнуляем предыдущие изменения в голах
        match.goalsForChange1 = 0;
        match.goalsAgainstChange1 = 0;
        match.goalsForChange2 = 0;
        match.goalsAgainstChange2 = 0;
      } else {
        // Обновляем изменения в голах в матче
        match.goalsForChange1 = goalsForChange1;
        match.goalsAgainstChange1 = goalsAgainstChange1;
        match.goalsForChange2 = goalsForChange2;
        match.goalsAgainstChange2 = goalsAgainstChange2;
      }

      // Обновляем забитые и пропущенные голы
      player1.goalsFor += goalsForChange1;
      player1.goalsAgainst += goalsAgainstChange1;
      player2.goalsFor += goalsForChange2;
      player2.goalsAgainst += goalsAgainstChange2;
      // Сохраняем обновленные данные игроков
      await player1.save();
      await player2.save();
    }

    // Возвращаем успешный ответ
    return res
      .status(200)
      .json({ message: "Результаты матча успешно обновлены" });
  } catch (error) {
    console.error("Ошибка при обновлении результатов матча:", error);
    return res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
};
