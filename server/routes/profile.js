const express = require('express');
const router = express.Router();
const { User } = require('../models');
const authenticate = require('../middleware/authenticate');

// Fetch user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { bio, profilePicture, travelHistory, travelPlans } = req.body;
    const user = await User.findOne({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.bio = bio || user.bio;
    user.profilePicture = profilePicture || user.profilePicture;
    user.travelHistory = travelHistory || user.travelHistory;
    user.travelPlans = travelPlans || user.travelPlans;
    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new travel plan
router.post('/travelPlans', authenticate, async (req, res) => {
  try {
    const { destination, date, details } = req.body;
    const user = await User.findOne({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const newTravelPlan = { destination, date, details };
    user.travelPlans = user.travelPlans ? [...user.travelPlans, newTravelPlan] : [newTravelPlan];
    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error adding travel plan:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete travel plan
router.delete('/travelPlans/:planId', authenticate, async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.travelPlans = user.travelPlans.filter((plan, index) => index !== parseInt(req.params.planId));
    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error deleting travel plan:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
