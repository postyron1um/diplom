// app.js
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoute from './routes/auth.js';
import tournamentRoute from './routes/tournaments.js';
import matchRoute from './routes/match.js'; // Импорт роута для матчей

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3001;
const DB_USER = process.env.DB_USER;
const DB_PASSWORLD = process.env.DB_PASSWORLD;
const DB_NAME = process.env.DB_NAME;

app.use(cors());
app.use(express.json());

// Подключаем роуты
app.use('/api/auth', authRoute);
app.use('/api/tournaments', tournamentRoute);
app.use('/api/tournaments/:tournamentId/matches', matchRoute); // Обновленный путь для матчей

async function start() {
  try {
    await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORLD}@cluster0.gb5p4gd.mongodb.net/${DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => console.log(`Server started in port: ${PORT}`));
  } catch (error) {
    console.log(error);
  }
}
start();
