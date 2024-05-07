import { configureStore } from '@reduxjs/toolkit';
import authSlice from './features/auth/authSlice';
import tournamentSlice from './features/tournament/tournamentSlice';
import participantSlice from './features/participant/participantSlice';
import matchSlice from './features/matchSlice/matchSlice';
import knockoutSlice from './features/knockout/knockoutSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    tournament: tournamentSlice,
    participant: participantSlice,
    matches: matchSlice,
		knockout: knockoutSlice,
  },
});
