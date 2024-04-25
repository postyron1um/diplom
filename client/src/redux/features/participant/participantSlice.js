import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../../utils/axios';

// import { participateInTournament } from '../tournament/tournamentSlice'; // Импорт функции participateInTournament из tournamentSlice

const initialState = {
  participants: [],
  loading: false,
  status: null,
};

export const participateInTournament = createAsyncThunk('participant/participateInTournament', async ({ userId, tournamentId }) => {
  try {
    // Отправляем запрос на регистрацию участника в турнире с указанием ID турнира и ID пользователя
    const response = await axios.post(`/tournaments/${tournamentId}/register`, { userId });
    console.log(response.data);

    return response.data;
  } catch (error) {
    // Возвращаем ошибку для обработки в UI
    // console.log(error);
  }
});

export const participantSlice = createSlice({
  name: 'participant',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(participateInTournament.pending, (state) => {
        state.loading = true;
        state.status = null;
      })
      .addCase(participateInTournament.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.message;
        state.participants = [...state.participants, action.payload.newParticipant];
      })
      .addCase(participateInTournament.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.message;
        // Можно добавить логику для обработки ошибок здесь, если это необходимо
      });
  },
});

export default participantSlice.reducer;
