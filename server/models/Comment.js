import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  text: { type: String, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;

// models/Comment.js

// import mongoose from 'mongoose';
// const Schema = mongoose.Schema;

// const commentSchema = new Schema({
//   userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   tournamentId: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true },
//   text: { type: String, required: true },
//   likes: { type: Number, default: 0 },
//   dislikes: { type: Number, default: 0 },
//   createdAt: { type: Date, default: Date.now },
// });
// const Comment = mongoose.model('Comment', commentSchema);

// export default Comment;
