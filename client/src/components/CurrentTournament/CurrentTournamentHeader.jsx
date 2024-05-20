// components/CurrentTournamentHeader.js

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteLoaderData } from 'react-router-dom';
import formatDate, { formatDateTime } from '../../Func/DateFormat';
import { addComment, fetchComments, likeComment, dislikeComment } from '../../redux/features/tournament/commentSlice';
import extractUserRoleFromToken from '../../Func/extractUserDetailsFromToken';

function CurrentTournamentHeader() {
  const tournament = useRouteLoaderData('all_tournaments');
  const dispatch = useDispatch();
  const { comments } = useSelector((state) => state.comments);
  const [commentText, setCommentText] = useState('');
  const userToken = localStorage.getItem('token');
  const userId = extractUserRoleFromToken(userToken, 'id');

  useEffect(() => {
    if (tournament._id) {
      dispatch(fetchComments(tournament._id));
    }
  }, [dispatch, tournament._id]);

  const handleAddComment = async () => {
    if (commentText.trim()) {
      await dispatch(addComment({ tournamentId: tournament._id, userId, text: commentText }));
      setCommentText('');
      dispatch(fetchComments(tournament._id)); // Перезагрузка комментариев после добавления нового
    }
  };

  const handleLike = async (commentId) => {
    await dispatch(likeComment({ commentId, tournamentId: tournament._id }));
  };

  const handleDislike = async (commentId) => {
    await dispatch(dislikeComment({commentId,tournamentId: tournament._id}));
  };

  return (
    <>
      <h1 className="current-tournament__h1">Название: {tournament.title}</h1>
      <h3 className="current-tournament__h3">
        <span className="current-tournament__span current-tournament__span-clr">Вид спорта:</span>
        <span className="current-tournament__span">{tournament.sportType}</span>
      </h3>
      <h3 className="current-tournament__h3">
        <span className="current-tournament__span current-tournament__span-clr">Тип турнира:</span>
        <span className="current-tournament__span">{tournament.typeTournament}</span>
      </h3>
      <h3 className="current-tournament__h3 current-tournament__h3-desc">
        <span className="current-tournament__span current-tournament__span-clr">Описание:</span>
        <span className="current-tournament__span sd">{tournament.tournamentDesc}</span>
      </h3>
      <h3 className="current-tournament__h3">
        <span className="current-tournament__span current-tournament__span-clr">Дата начала:</span>
        <span className="current-tournament__span">{formatDate(tournament.startDate)}</span>
      </h3>
      <h3 className="current-tournament__h3">
        <span className="current-tournament__span current-tournament__span-clr">Дата конца:</span>
        <span className="current-tournament__span">{formatDate(tournament.endDate)}</span>
      </h3>

      <div className="comments-section">
        <div className="comments-display">
          <h3 className='comments-h3'>Комментарии:</h3>
          <ul className='comments-list'>
            {comments?.map((comment) => (
              <li className='comments-item' key={comment._id}>
                <p>
                  <strong>{comment.username}:</strong> {comment.text}
                </p>
                <p>{formatDateTime(comment.createdAt)}</p>
                {/* <div>
                  <button onClick={() => handleLike(comment._id)}>👍 {comment.likes}</button>
                  <button onClick={() => handleDislike(comment._id)}>👎 {comment.dislikes}</button>
                </div> */}
              </li>
            ))}
          </ul>
        </div>
        <div className="comments-add">
          <textarea className='comments-textarea' value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Добавить комментарий" />
          <button className='comments-add-btn' onClick={handleAddComment}>Отправить</button>
        </div>
        
      </div>
    </>
  );
}

export default CurrentTournamentHeader;
