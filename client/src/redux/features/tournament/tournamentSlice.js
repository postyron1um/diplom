import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../../utils/axios';

const initialState = {
  tournaments: [],
  loading: false,
  participants: [],
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



export const tournamentSlice = createSlice({
  name: 'tournament',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Create tournament
    builder
      .addCase(createTournament.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTournament.fulfilled, (state, action) => {
        state.loading = false;
        state.tournaments.push(action.payload);
      })
      .addCase(createTournament.rejected, (state) => {
        // state.status = action.payload.message;
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
        });
  },
});

export default tournamentSlice.reducer;
