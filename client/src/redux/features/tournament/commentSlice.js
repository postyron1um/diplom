// redux/features/tournament/commentSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../utils/axios';

export const fetchComments = createAsyncThunk('comments/fetchComments', async (tournamentId) => {
  const response = await axios.get(`/tournaments/${tournamentId}/comments`);
  return response.data.comments;
});

export const addComment = createAsyncThunk('comments/addComment', async ({ tournamentId, userId, text }) => {
  const response = await axios.post(`/tournaments/${tournamentId}/comments`, { userId, text });
  return response.data.comment;
});

export const likeComment = createAsyncThunk('comments/likeComment', async ({ commentId, tournamentId }) => {
  const response = await axios.post(`/tournaments/${tournamentId}/comments/${commentId}/like`);
  return response.data.comment;
});

export const dislikeComment = createAsyncThunk('comments/dislikeComment', async ({ commentId, tournamentId }) => {
  const response = await axios.post(`/tournaments/${tournamentId}/comments/${commentId}/dislike`);
  return response.data.comment;
});

export const deleteComment = createAsyncThunk('comments/deleteComment', async ({ tournamentId, commentId }) => {
  await axios.delete(`/tournaments/${tournamentId}/comments/${commentId}`);
  return commentId;
});

const commentSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })
      .addCase(likeComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex((comment) => comment._id === action.payload._id);
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })
      .addCase(dislikeComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex((comment) => comment._id === action.payload._id);
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter((comment) => comment._id !== action.payload);
      });
  },
});

export default commentSlice.reducer;
