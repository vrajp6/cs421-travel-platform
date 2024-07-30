import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ThumbsUp, MessageCircle } from 'lucide-react';
import './PostStyles.css';

const Post = ({ post, onDelete, currentUserId }) => {
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

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

  useEffect(() => {
    fetchCommentCount();
  }, [fetchCommentCount]);

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
      onDelete(post.id);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleLikeToggle = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = isLiked ? 'unlike' : 'like';
      const response = await axios.post(`http://localhost:5000/api/posts/${post.id}/${endpoint}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLikes(response.data.likes);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleAddComment = async () => {
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

  return (
    <div className="post">
      <div className="post-header">
        <div className="user-info">
          <img 
            src={post.User?.profilePicture || '/images/default-avatar.png'} 
            alt="User avatar" 
            className="avatar" 
          />
          <div className="post-info">
            <h3>{post.User?.username || 'Unknown User'}</h3>
            <p className="location">{post.location || 'Unknown Location'}</p>
          </div>
        </div>
        {post.userId === currentUserId && (
          <button onClick={handleDelete} className="delete-button">Delete</button>
        )}
      </div>
      <p className="post-content">{post.content}</p>
      {post.imageUrl && <img src={post.imageUrl} alt="Post" className="post-image" />}
      <div className="post-actions">
        <button 
          onClick={handleLikeToggle} 
          className={`action-button ${isLiked ? 'liked' : ''}`}
        >
          <ThumbsUp size={16} />
          <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
        </button>
        <button 
          onClick={toggleComments}
          className="action-button"
        >
          <MessageCircle size={16} />
          <span>{commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}</span>
        </button>
      </div>
      <p className="post-date">{new Date(post.createdAt).toLocaleString()}</p>
      
      {showComments && (
        <div className="comments-section">
          <div className="add-comment">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
            />
            <button onClick={handleAddComment}>Post</button>
          </div>
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
                  <p>{comment.content}</p>
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