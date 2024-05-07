// matchSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../utils/axios.js';

const initialState = {
  matches: [],
  status: null,
  error: null,
};

export const fetchMatches = createAsyncThunk('matches/fetchMatches', async ({ tournamentId }) => {
  const response = await axios.get(`/tournaments/${tournamentId}/matches`);
  return response.data.matches;
});

export const addMatch = createAsyncThunk('matches/addMatch', async ({ matchData, tournamentId }) => {
  const response = await axios.post(`/tournaments/${tournamentId}/matches`, matchData);
  console.log(matchData);

  return response.data.match;
});

export const updateMatchResult = createAsyncThunk(
  'matches/updateMatchResult',
  async ({ matchId, score1, score2, tournamentId }) => {
    const response = await axios.put(`/tournaments/${tournamentId}/matches/${matchId}/result`, { score1, score2, matchId });
    return response.data.message; // Возвращаем сообщение об успешном обновлении
  },
);

const matchSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => {
        state.status = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.status = null;
        state.matches = action.payload;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message;
      })
      .addCase(addMatch.fulfilled, (state, action) => {
        state.matches.push(action.payload);
        state.status = action.payload.message;
      })
      .addCase(addMatch.rejected, (state,action) => {
        // state.matches.push(action.payload);
        state.status = action.payload.message;
      })
      .addCase(updateMatchResult.fulfilled, (state, action) => {
        // Обновляем состояние матчей после успешного обновления результатов матча
        state.matches = state.matches.map((match) =>
          match._id === action.payload.matchId
            ? { ...match, score1: action.payload.score1, score2: action.payload.score2 }
            : match,
        );
      });
  },
});

export default matchSlice.reducer;
