import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../../utils/axios';

const initialState = {
  pendingParticipants: {},
  acceptedParticipants: {},
  loading: false,
  status: null,
};

export const participateInTournament = createAsyncThunk(
  'participant/participateInTournament',
  async ({ userId, tournamentId }) => {
    try {
      const response = await axios.post(`/tournaments/${tournamentId}/register`, { userId });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
);

export const acceptParticipant = createAsyncThunk('participant/acceptParticipant', async ({ tournamentId, participantId }) => {
  const response = await axios.put(`/tournaments/${tournamentId}/participants/${participantId}/accept`);
  console.log('response.data', response.data);
  return response.data;
});

export const rejectParticipant = createAsyncThunk('participant/rejectParticipant', async ({ tournamentId, participantId }) => {
  const response = await axios.put(`/tournaments/${tournamentId}/participants/${participantId}/reject`);
  console.log(response.data);
  return response.data;
});

export const getAllParticipate = createAsyncThunk('participant/getAllParticipate', async ({ tournamentId }) => {
  const { data } = await axios.get(`/tournaments/${tournamentId}/participants`);
  return { tournamentId, participants: data.participants };
});

export const getAllAcceptedParticipants = createAsyncThunk('participant/getAllAcceptedParticipants', async ({ tournamentId }) => {
  try {
    const response = await axios.get(`/tournaments/${tournamentId}/participants/accepted`);
		console.log(response.data);
		
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

const participantSlice = createSlice({
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

        const { tournamentId, newParticipant } = action.payload;

        if (!state.pendingParticipants[tournamentId]) {
          state.pendingParticipants[tournamentId] = [];
        }

        // Добавляем нового участника в список участников для данного турнира
        state.pendingParticipants[tournamentId].push(newParticipant);
      })
      .addCase(participateInTournament.rejected, (state, action) => {
        state.loading = false;
        state.status = action.error.message || 'Ошибка регистрации';
      });
    builder
      .addCase(getAllParticipate.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllParticipate.fulfilled, (state, action) => {
        const { tournamentId, participants } = action.payload;

        // Разбиваем участников на pending и accepted
        const pendingParticipants = participants.filter((participant) => participant.status === 'pending');
        const acceptedParticipants = participants.filter((participant) => participant.status === 'accepted');

        state.pendingParticipants[tournamentId] = pendingParticipants;
        state.acceptedParticipants[tournamentId] = acceptedParticipants;
      })
      .addCase(getAllParticipate.rejected, (state) => {
        state.loading = false;
        state.status = 'Ошибка загрузки участников';
      })
      .addCase(acceptParticipant.fulfilled, (state, action) => {
        const { tournament, user } = action.payload;

        // Удаляем принятого участника из списка "pendingParticipants"
        state.pendingParticipants[tournament] = state.pendingParticipants[tournament].filter(
          (participant) => participant.user !== user,
        );

        // Добавляем принятого участника в список "acceptedParticipants"
        if (!state.acceptedParticipants[tournament]) {
          state.acceptedParticipants[tournament] = [];
        }
        state.acceptedParticipants[tournament].push(action.payload);
      });
			builder
        .addCase(getAllAcceptedParticipants.pending, (state) => {
          state.loading = true;
          state.status = null;
        })
        .addCase(getAllAcceptedParticipants.fulfilled, (state, action) => {
          state.loading = false;
          state.status = 'success';
          state.acceptedParticipants = action.payload;
        })
        .addCase(getAllAcceptedParticipants.rejected, (state, action) => {
          state.loading = false;
          state.status = 'error';
          console.error('Error:', action.error.message);
        });
  },
});

export default participantSlice.reducer;
