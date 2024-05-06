import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../../utils/axios.js';

const initialState = {
  tournaments: [],
  loading: false,
	status:null,
  participants: [],
  isTournamentStarted: null,
};

export const createTournament = createAsyncThunk('tournament/createTournament', async (params) => {
  console.log(params);

  try {
    const { data } = await axios.post('/tournaments', params);
    return data;
  } catch (error) {
    console.log(error);
  }
});

export const getAllTournaments = createAsyncThunk('tournament/getAllTournaments', async () => {
  try {
    const { data } = await axios.get('/tournaments');

    return data;
  } catch (error) {
    console.log(error);
  }
});

export const getTournamentParticipants = createAsyncThunk('tournament/getTournamentParticipants', async (tournamentId) => {
  try {
    const { data } = await axios.get(`/tournaments/${tournamentId}`);
    return data.participants;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const updateTournamentStatus = createAsyncThunk('matches/updateTournamentStatus', async ({ tournamentId }) => {
  const response = await axios.put(`/tournaments/${tournamentId}/status`);
  console.log(response.data.success);
  return response.data.success; // Возвращаем обновленное значение статуса турнира
});

export const tournamentSlice = createSlice({
  name: 'tournament',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Create tournament
    builder
      .addCase(createTournament.pending, (state) => {
        state.loading = true;
				state.status = null
      })
      .addCase(createTournament.fulfilled, (state, action) => {
        state.loading = false;
        state.tournaments.push(action.payload);
				state.status = action.payload.message;
      })
      .addCase(createTournament.rejected, (state,action) => {
        state.status = action.payload.message;
        state.loading = false;
      });
    // Получение всех турниров
    builder
      .addCase(getAllTournaments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllTournaments.fulfilled, (state, action) => {
        state.loading = false;
        state.tournaments = action.payload.tournaments;
      })
      .addCase(getAllTournaments.rejected, (state) => {
        // state.status = action.payload.message;
        state.loading = false;
      });
    builder
      .addCase(getTournamentParticipants.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTournamentParticipants.fulfilled, (state, action) => {
        state.loading = false;
        state.participants = action.payload;
      })
      .addCase(getTournamentParticipants.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateTournamentStatus.fulfilled, (state, action) => {
        // Обновляем состояние isTournamentStarted после успешного обновления статуса турнира
				console.log('Action payload:', action.payload);
        state.isTournamentStarted = action.payload;
      });
  },
});

export default tournamentSlice.reducer;
