// matchSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../utils/axios';

const initialState = {
  matches: [],
  status: 'idle',
  error: null,
};

export const fetchMatches = createAsyncThunk('matches/fetchMatches', async ({ tournamentId }) => {
  const response = await axios.get(`/tournaments/${tournamentId}/matches`);
  return response.data.matches;
});

export const addMatch = createAsyncThunk('matches/addMatch', async ({matchData,tournamentId}) => {
  const response = await axios.post(`/tournaments/${tournamentId}/matches`, matchData);
	console.log(matchData);
	
  return response.data.match;
});


export const updateMatch = createAsyncThunk('matches/updateMatch', async ({ matchId, score1, score2 }) => {
  try {
    const response = await axios.put(`/api/matches/${matchId}`, { score1, score2 });
    return response.data.match;
  } catch (error) {
    throw error;
  }
});


const matchSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.status = 'idle';
        state.matches = action.payload;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message;
      })
      .addCase(addMatch.fulfilled, (state, action) => {
        state.matches.push(action.payload);
      })
      builder
        .addCase(updateMatch.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(updateMatch.fulfilled, (state, action) => {
          state.status = 'idle';
					
          state.matches = state.matches.map((match) => (match._id === action.payload._id ? action.payload : match));
        })
        .addCase(updateMatch.rejected, (state, action) => {
          state.status = 'idle';
          state.error = action.error.message;
        });
  },
});

export default matchSlice.reducer;
