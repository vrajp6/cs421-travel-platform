const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { User } = require('../models');

// Get user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id }
    });
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { bio, profilePicture, travelHistory } = req.body;
    await User.update(
      { bio, profilePicture, travelHistory },
      { where: { id: req.user.id } }
    );
    const updatedUser = await User.findOne({
      where: { id: req.user.id }
    });
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;