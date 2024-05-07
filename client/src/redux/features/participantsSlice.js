// // participantSlice.js

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from '../../utils/axios';

// export const getAllParticipate = createAsyncThunk('participant/getAllParticipate', async ({ tournamentId }) => {
//   const { data } = await axios.get(`/tournaments/${tournamentId}/participants`);
  
//   // Фильтруем только участников с определенными статусами
//   const filteredParticipants = data.participants.filter(participant => participant.status === 'accepted' || participant.status === 'pending');

//   return { tournamentId, participants: filteredParticipants };
// });

// export const acceptParticipant = createAsyncThunk('participant/acceptParticipant', async ({ tournamentId, participantId }) => {
//   const response = await axios.put(`/tournaments/${tournamentId}/participants/${participantId}/accept`);
//   return response.data;
// });


// export const rejectParticipant = createAsyncThunk('participant/rejectParticipant', async ({ tournamentId, participantId }) => {
//   const response = await axios.put(`/tournaments/${tournamentId}/participants/${participantId}/reject`);
//   console.log(response.data);
//   return response.data;

// });

// const participantSlice = createSlice({
//   name: 'participant',
//   initialState: {
//     tournaments: {},
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(getAllParticipate.fulfilled, (state, action) => {
//         const { tournamentId, participants } = action.payload;
//         state.tournaments[tournamentId] = participants;
//       })
//       .addCase(acceptParticipant.fulfilled, (state, action) => {
//         const { tournament, user } = action.payload;
//         state.tournaments[tournament] = state.tournaments[tournament].filter(participant => participant.user !== user);
//       })
//       .addCase(rejectParticipant.fulfilled, (state, action) => {
//         const { tournament, user } = action.payload;
//         console.log('user',user);
//         console.log('tournament', tournament);
//         state.tournaments[tournament] = state.tournaments[tournament].filter(participant => participant.user !== user);
//       });
//   },
// });

// export default participantSlice.reducer;