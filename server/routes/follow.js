const express = require('express');
const router = express.Router();
const db = require('../models'); // Ensure this is correct
const authenticate = require('../middleware/authenticate'); // Import the correct authentication middleware

// Follow a user
router.post('/follow/:id', authenticate, async (req, res) => {
    const followerId = req.userId;
    const followingId = req.params.id;
  
    try {
      const existingFollow = await db.sequelize.query('SELECT * FROM follows WHERE follower_id = $1 AND following_id = $2', {
        bind: [followerId, followingId],
        type: db.sequelize.QueryTypes.SELECT
      });
  
      if (existingFollow.length > 0) {
        return res.json({ message: 'Already following this user' });
      }
  
      await db.sequelize.query('INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)', {
        bind: [followerId, followingId]
      });
      res.json({ message: 'Followed user successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to follow user' });
    }
  });
  
  
  // Unfollow a user
  router.post('/unfollow/:id', authenticate, async (req, res) => {
    const followerId = req.userId;
    const followingId = req.params.id;
  
    try {
      await db.sequelize.query('DELETE FROM follows WHERE follower_id = $1 AND following_id = $2', {
        bind: [followerId, followingId]
      });
      res.json({ message: 'Unfollowed user successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to unfollow user' });
    }
  });
  

// Get follow status
router.get('/follow/status/:id', authenticate, async (req, res) => {
    const followerId = req.userId;
    const followingId = req.params.id;
  
    try {
      const result = await db.sequelize.query(
        'SELECT * FROM follows WHERE follower_id = $1 AND following_id = $2',
        {
          bind: [followerId, followingId],
          type: db.sequelize.QueryTypes.SELECT,
        }
      );
      
      const isFollowing = result.length > 0;
      res.json({ isFollowing });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch follow status' });
    }
});

  
  

module.exports = router;
