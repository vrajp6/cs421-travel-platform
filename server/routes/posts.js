const express = require('express');
const router = express.Router();
const { Post, User, Comment } = require('../models');
const authenticate = require('../middleware/authenticate');

// Create a new post
router.post('/', authenticate, async (req, res) => {
  try {
    const { content, location } = req.body;
    let imageFile = req.body.imageUrl;

    if (!imageFile) {
      imageFile = null;
    }

    const post = await Post.create({
      userId: req.userId,
      content,
      location,
      imageFile
    });
    
    const postWithUser = await Post.findByPk(post.id, {
      include: [{ 
        model: User, 
        attributes: ['id', 'username', 'profilePicture'] 
      }]
    });
    
    res.status(201).json(postWithUser);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [{ 
        model: User, 
        attributes: ['id', 'username', 'profilePicture'],
      }],
      order: [['createdAt', 'DESC']]
    });
    const postsWithFullUrls = posts.map(post => {
      const jsonPost = post.toJSON();
      if (jsonPost.User && jsonPost.User.profilePicture) {
        jsonPost.User.profilePicture = jsonPost.User.profilePicture.startsWith('http') 
          ? jsonPost.User.profilePicture 
          : `http://localhost:5000${jsonPost.User.profilePicture}`;
      }
      return jsonPost;
    });
    res.json(postsWithFullUrls);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a specific post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['username', 'profilePicture'] }]
    });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a post
router.put('/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (post.userId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    const { content, location, imageFile } = req.body;
    await post.update({ content, location, imageFile });
    res.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a post
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (post.userId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await post.destroy();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get posts for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { userId: req.params.userId },
      include: [{ 
        model: User, 
        attributes: ['id', 'username', 'profilePicture'],
        required: false
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle like on a post
router.post('/:id/toggle-like', authenticate, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const user = await User.findByPk(req.userId);
    const hasLiked = await post.hasLikedBy(user);
    
    if (hasLiked) {
      await post.removeLikedBy(user);
    } else {
      await post.addLikedBy(user);
    }
    
    const likeCount = await post.countLikedBy();
    res.json({ likes: likeCount, isLiked: !hasLiked });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get like status for a post
router.get('/:id/like-status', authenticate, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const user = await User.findByPk(req.userId);
    const isLiked = await post.hasLikedBy(user);
    const likeCount = await post.countLikedBy();
    
    res.json({ isLiked, likes: likeCount });
  } catch (error) {
    console.error('Error fetching like status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get comments for a post
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { postId: req.params.id },
      include: [{ model: User, attributes: ['id', 'username', 'profilePicture'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a comment to a post
router.post('/:id/comments', authenticate, async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.create({
      content,
      userId: req.userId,
      postId: req.params.id
    });
    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [{ model: User, attributes: ['id', 'username', 'profilePicture'] }]
    });
    res.status(201).json(commentWithUser);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Get comment count for a post
router.get('/:id/comments/count', async (req, res) => {
  try {
    const count = await Comment.count({
      where: { postId: req.params.id }
    });
    res.json({ count });
  } catch (error) {
    console.error('Error fetching comment count:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
