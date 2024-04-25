import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../../utils/axios';

// import { participateInTournament } from '../tournament/tournamentSlice'; // Импорт функции participateInTournament из tournamentSlice

const initialState = {
  participants: [],
  loading: false,
  status: null,
};

export const participateInTournament = createAsyncThunk(
  'participant/participateInTournament',
  async ({ userId, tournamentId }) => {
    try {
      // Отправляем запрос на регистрацию участника в турнире с указанием ID турнира и ID пользователя
      const response = await axios.post(`/tournaments/${tournamentId}/register`, { userId });
      console.log(response.data);

      return response.data;
    } catch (error) {
      // Возвращаем ошибку для обработки в UI
      // console.log(error);
    }
  },
);

export const getAllParticipate = createAsyncThunk('participant/getAllParticipate', async ({ tournamentId }) => {
  try {
    const { data } = await axios.get(`/tournaments/${tournamentId}`, );
    const users = data.participants.map((participant) => participant.user);
    console.log(users);

    return users;
  } catch (error) {
    console.log(error);
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
        // console.log(action.payload.newParticipant.user);

        state.participants.push(action.payload.newParticipant?.user);

        // Можно добавить дополнительную логику здесь, если это необходимо
      })
      .addCase(participateInTournament.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.message;
        // Можно добавить логику для обработки ошибок здесь, если это необходимо
      });
			 builder
         .addCase(getAllParticipate.pending, (state) => {
           state.loading = true;
         })
         .addCase(getAllParticipate.fulfilled, (state, action) => {
           state.loading = false;
           state.participants = action.payload;
         })
         .addCase(getAllParticipate.rejected, (state) => {
           // state.status = action.payload.message;
           state.loading = false;
         });
  },
});

export default participantSlice.reducer;
