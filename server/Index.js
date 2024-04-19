import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoute from './routes/auth.js';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3001;
const DB_USER = process.env.DB_USER;
const DB_PASSWORLD = process.env.DB_PASSWORLD;
const DB_NAME = process.env.DB_NAME;

app.use(cors());
app.use(express.json());

// Routes
// http://localhost:3002/
app.use('/api/auth', authRoute);

async function start() {
  try {
    await mongoose.connect(
      `mongodb+srv://${DB_USER}:${DB_PASSWORLD}@cluster0.gb5p4gd.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`,
    );
    app.listen(PORT, () => console.log(`Server started in port: ${PORT}`));
  } catch (error) {
    console.log(error);
  }
}
start();
