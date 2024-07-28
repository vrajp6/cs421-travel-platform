const express = require('express');
const router = express.Router();
const { User } = require('../models');
const authenticate = require('../middleware/authenticate');
const { Sequelize, Op } = require('sequelize')

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

router.get('/profile/:username', async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.params.username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Search users by username or travel history
router.get('/search', async (req, res) => {
  const { query } = req.query;
  console.log('Received search query:', query);
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const users = await User.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.iLike]: `%${query}%` } },
          { travelHistory: { [Op.contains]: [query] } }
        ]
      }
    });

    console.log('Search results:', users);

    if (users.length === 0) {
      return res.status(404).json({ error: 'No users found' });
    }

    res.json(users);
  } catch (error) {
    console.error('Error searching profiles:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { username, bio, travelHistory } = req.body;
    console.log('Request Body:', req.body);
    const user = await User.findOne({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.username = username !== undefined ? username : user.username;
    user.bio = bio !== undefined ? bio : user.bio;
    user.travelHistory = travelHistory !== undefined ? travelHistory : user.travelHistory;
    await user.save();
    console.log('Updated User:', user);
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
