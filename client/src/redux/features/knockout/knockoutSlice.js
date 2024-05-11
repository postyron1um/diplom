// tournamentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../utils/axios';

// /api/tournaments/:tournamentId/knockout

export const fetchMatches = createAsyncThunk('tournament/fetchMatches', async (tournamentId) => {
  const response = await axios.get(`/tournaments/${tournamentId}/knockout/matches`);
	console.log('fetchMatches', response.data);
	
  return response.data;
});

export const createNewMatch = createAsyncThunk('tournament/createNewMatch', async ({ tournamentId,initialRoundMatches }) => {
  console.log('initialRoundMatches', initialRoundMatches);

  const response = await axios.post(`/tournaments/${tournamentId}/knockout/matches`, { initialRoundMatches, tournamentId });
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

export const acceptParticipant = createAsyncThunk('tournament/acceptParticipant', async ({ tournamentId, participantId }) => {
  const response = await axios.put(`/tournaments/${tournamentId}/knockout/participants/${participantId}/accept`);
  const resData = response.data;
  return { tournamentId, participantId, resData };
});

export const rejectParticipant = createAsyncThunk('tournament/rejectParticipant', async ({ tournamentId, participantId }) => {
  const response = await axios.put(`/tournaments/${tournamentId}/knockout/participants/${participantId}/reject`);
  const resData = response.data;
  return { tournamentId, participantId, resData };
});



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
      // .addCase(fetchMatches.pending, (state) => {
      //   state.status = 'loading';
      // })
      // .addCase(fetchMatches.fulfilled, (state, action) => {
      //   state.status = 'succeeded';
      //   state.matches = action.payload;
      // })
      // .addCase(fetchMatches.rejected, (state, action) => {
      //   state.status = 'failed';
      //   state.error = action.error.message;
      // })
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
      })
      .addCase(acceptParticipant.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(acceptParticipant.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Мы можем обновить статус участника на "accepted" в соответствии с данными из ответа
        const { tournamentId, participantId, response } = action.payload;
        state.participants = state.participants.map((participant) =>
          participant._id === participantId && participant.tournament === tournamentId
            ? { ...participant, status: 'accepted' }
            : participant,
        );
      })
      .addCase(acceptParticipant.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(rejectParticipant.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(rejectParticipant.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Мы можем обновить статус участника на "rejected" в соответствии с данными из ответа
        const { tournamentId, participantId, response } = action.payload;
        state.participants = state.participants.map((participant) =>
          participant._id === participantId && participant.tournament === tournamentId
            ? { ...participant, status: 'rejected' }
            : participant,
        );
      })
      .addCase(rejectParticipant.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default tournamentSlice.reducer;
