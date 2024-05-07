// tournamentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../utils/axios'

export const fetchMatches = createAsyncThunk('tournament/fetchMatches', async (tournamentId) => {
  const response = await axios.get(`/tournaments/${tournamentId}/knockout/matches`);
  return response.data;
});

export const createNewMatch = createAsyncThunk('tournament/createNewMatch', async ({ tournamentId, team1, team2 }) => {
  const response = await axios.post(`/tournaments/${tournamentId}/knockout/matches`, { team1, team2 });
  return response.data;
});

export const fetchParticipants = createAsyncThunk('tournament/fetchParticipants', async (tournamentId) => {
  const response = await axios.get(`/tournaments/${tournamentId}/knockout/participants`);
  return response.data;
});

export const createNewParticipant = createAsyncThunk(
  'tournament/createNewParticipant',
  async ({ tournamentId, user, username }) => {
    const response = await axios.post(`/tournaments/${tournamentId}/knockout/participants`, { user, username });
    return response.data;
  },
);

const tournamentSlice = createSlice({
  name: 'tournament',
  initialState: {
    matches: [],
    participants: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.matches = action.payload;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createNewMatch.fulfilled, (state, action) => {
        state.matches.push(action.payload);
      })
      .addCase(fetchParticipants.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchParticipants.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.participants = action.payload;
      })
      .addCase(fetchParticipants.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createNewParticipant.fulfilled, (state, action) => {
        state.participants.push(action.payload);
      });
  },
});

export default tournamentSlice.reducer;
