import { configureStore } from '@reduxjs/toolkit';
import authSlice from './features/auth/authSlice';
import tournamentSlice from './features/tournament/tournamentSlice';
import participantSlice from './features/participant/participantSlice';
import matchSlice from './features/matchSlice/matchSlice';
import participantsSlice from './features/participantsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    tournament: tournamentSlice,
    pendingParticipant: participantsSlice,
    participant: participantSlice,
    matches: matchSlice,
  },
});
