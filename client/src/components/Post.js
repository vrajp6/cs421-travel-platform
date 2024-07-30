import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ThumbsUp, MessageCircle, MoreVertical, Trash2 } from 'lucide-react';
import './PostStyles.css';

const Post = ({ post, onDelete, currentUserId, isProfilePage }) => {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/posts/${post.id}/comments`);
      setComments(response.data);
      setCommentCount(response.data.length);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [post.id]);

  const fetchCommentCount = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/posts/${post.id}/comments/count`);
      setCommentCount(response.data.count);
    } catch (error) {
      console.error('Error fetching comment count:', error);
    }
  }, [post.id]);

  const fetchLikeStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/posts/${post.id}/like-status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsLiked(response.data.isLiked);
      setLikes(response.data.likes);
    } catch (error) {
      console.error('Error fetching like status:', error);
    }
  }, [post.id]);

  useEffect(() => {
    fetchCommentCount();
    fetchLikeStatus();
  }, [fetchCommentCount, fetchLikeStatus]);

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments, fetchComments]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/posts/${post.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.removeItem(`post_${post.id}_liked`);
      onDelete(post.id);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleLikeToggle = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:5000/api/posts/${post.id}/toggle-like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLikes(response.data.likes);
      setIsLiked(response.data.isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/posts/${post.id}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(prevComments => [response.data, ...prevComments]);
      setCommentCount(prevCount => prevCount + 1);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div className={`post ${isProfilePage ? 'profile-post' : ''}`}>
      <div className="post-header">
        <div className="user-info">
          <img 
            src={post.User?.profilePicture || 'http://localhost:5000/uploads/default-profile-picture.png'} 
            alt="User avatar" 
            className="avatar" 
          />
          <div className="post-info">
            <h3>{post.User?.username || 'Unknown User'}</h3>
            <p className="location">{post.location || 'Unknown Location'}</p>
          </div>
        </div>
        {post.userId === currentUserId && (
          <div className="post-options">
            <button onClick={toggleOptions} className="options-button">
              <MoreVertical size={20} />
            </button>
            {showOptions && (
              <div className="options-menu">
                <button onClick={handleDelete} className="delete-button">
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <p className="post-content">{post.content}</p>
      {post.imageUrl && <img src={post.imageUrl} alt="Post" className="post-image" />}
      <div className="post-actions">
        <button 
          onClick={handleLikeToggle} 
          className={`action-button ${isLiked ? 'liked' : ''}`}
        >
          <ThumbsUp size={20} />
          <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
        </button>
        <button 
          onClick={toggleComments}
          className="action-button"
        >
          <MessageCircle size={20} />
          <span>{commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}</span>
        </button>
      </div>
      <p className="post-date">{new Date(post.createdAt).toLocaleString()}</p>
      
      {showComments && (
        <div className="comments-section">
          <form onSubmit={handleAddComment} className="add-comment">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
            />
            <button type="submit">Post</button>
          </form>
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment">
                <img
                  src={comment.User.profilePicture || '/images/default-avatar.png'}
                  alt="User avatar"
                  className="comment-avatar"
                />
                <div className="comment-content">
                  <p className="comment-username">{comment.User.username}</p>
                  <p className="comment-text">{comment.content}</p>
                  <p className="comment-date">{new Date(comment.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
