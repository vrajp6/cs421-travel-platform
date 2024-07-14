const express = require('express');
const User = require('../models/user');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Get user profile
router.get('/profile', authenticate, async (req, res) => {
  console.log('Fetching profile for user:', req.userId); // Log userId
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err); // Log the error
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  const { bio, profilePicture, travelHistory } = req.body;
  console.log('Updating profile for user:', req.userId); // Log userId

  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    user.bio = bio || user.bio;
    user.profilePicture = profilePicture || user.profilePicture;
    user.travelHistory = travelHistory || user.travelHistory;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error('Error updating user profile:', err); // Log the error
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; // Export the router
