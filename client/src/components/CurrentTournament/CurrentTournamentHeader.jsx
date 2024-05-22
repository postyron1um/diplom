// components/CurrentTournamentHeader.js

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteLoaderData } from 'react-router-dom';
import formatDate, { formatDateTime } from '../../Func/DateFormat';
import {
  addComment,
  fetchComments,
  likeComment,
  dislikeComment,
  deleteComment,
} from '../../redux/features/tournament/commentSlice';
import extractUserRoleFromToken from '../../Func/extractUserDetailsFromToken';
import Modal from '../Modal/Modal';

function CurrentTournamentHeader() {
  const tournament = useRouteLoaderData('all_tournaments');
  const dispatch = useDispatch();
  const { comments } = useSelector((state) => state.comments);
  const [commentText, setCommentText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const userToken = localStorage.getItem('token');
  const userId = extractUserRoleFromToken(userToken, 'id');
  const role = extractUserRoleFromToken(userToken, 'roles');
  const isAdmin = Array.isArray(role) && role.includes('ADMIN');
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
    await dispatch(dislikeComment({ commentId, tournamentId: tournament._id }));
  };

  const openModal = (commentId) => {
    setCommentToDelete(commentId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCommentToDelete(null);
  };

  const confirmDeleteComment = async () => {
    if (commentToDelete) {
      await dispatch(deleteComment(commentToDelete));
      dispatch(fetchComments(tournament._id)); // Перезагрузка комментариев после удаления
      closeModal();
    }
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
          <h3 className="comments-h3">Комментарии:</h3>
          <div className="comments-add">
            <div className="messageBox">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Добавить комментарий..."
                type="text"
                id="messageInput"
              />
              <button onClick={handleAddComment} id="sendButton">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 664 663">
                  <path
                    fill="none"
                    d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"></path>
                  <path
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="33.67"
                    stroke="#6c6c6c"
                    d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"></path>
                </svg>
              </button>
            </div>
          </div>
          <ul className="comments-list">
            {comments?.map((comment) => (
              <li className="comments-item" key={comment._id}>
                <p>
                  <strong>{comment.username}:</strong> {comment.text}
                </p>
                <div className="comments-item-delete">
                  <p>{formatDateTime(comment.createdAt)}</p>
                  {isAdmin && (
                    <div className="ui-btn-div">
                      <button className="ui-btn" onClick={() => openModal(comment._id)}>
                        Удалить
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <p>Вы уверены, что хотите удалить этот комментарий?</p>
          <div className="btn-div-delete">
            <button className="delete-btn" onClick={confirmDeleteComment}>
              Удалить
            </button>
            <button className="cancell-btn" onClick={closeModal}>
              Отмена
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

export default CurrentTournamentHeader;
