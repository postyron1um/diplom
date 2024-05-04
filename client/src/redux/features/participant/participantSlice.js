import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../../utils/axios';

const initialState = {
  tournaments: {},
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

export const getAllParticipate = createAsyncThunk('participant/getAllParticipate', async ({ tournamentId }) => {
  try {
    const { data } = await axios.get(`/tournaments/${tournamentId}/participants`);
    // console.log(data);

    return { tournamentId, participants: data.participants };
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
        console.log(tournamentId);
        console.log(newParticipant);

        // Создаем новый массив участников для данного турнира,
        // если он еще не существует
        if (!state.tournaments[tournamentId]) {
          state.tournaments[tournamentId] = [];
        }

        // Добавляем нового участника в список участников для данного турнира
        state.tournaments[tournamentId].push(newParticipant);
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
        state.loading = false;
        const { tournamentId, participants } = action.payload;
        // Очищаем данные участников для текущего турнира перед загрузкой новых данных
        state.tournaments[tournamentId] = participants;
      })
      .addCase(getAllParticipate.rejected, (state) => {
        state.loading = false;
        state.status = 'Ошибка загрузки участников';
      });
  },
});

export default participantSlice.reducer;
