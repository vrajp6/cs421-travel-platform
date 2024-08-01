const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { User } = require('../models');
const authenticate = require('../middleware/authenticate');
const { Sequelize, Op } = require('sequelize');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Define the default profile picture path
const DEFAULT_PROFILE_PICTURE = '/uploads/default-profile-picture.png';

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Fetch user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!user.profilePicture) {
      user.profilePicture = DEFAULT_PROFILE_PICTURE;
      await user.save(); // Update the user profile picture in the database
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

// Update user profile with profile picture
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { username, bio, travelHistory, profilePicture } = req.body;
    const user = await User.findOne({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.username = username !== undefined ? username : user.username;
    user.bio = bio !== undefined ? bio : user.bio;
    user.travelHistory = travelHistory !== undefined ? travelHistory : user.travelHistory;
    user.profilePicture = profilePicture !== undefined ? profilePicture : user.profilePicture;
    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Fetch profile pictures for a list of user IDs
router.post('/profile-pictures', async (req, res) => {
  try {
    const { userIds } = req.body;
    const users = await User.findAll({
      where: { id: userIds },
      attributes: ['id', 'profilePicture']
    });
    const profilePictures = {};
    users.forEach(user => {
      profilePictures[user.id] = user.profilePicture || '/uploads/default-profile-picture.png';
    });
    res.json(profilePictures);
  } catch (error) {
    console.error('Error fetching profile pictures:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload profile picture and resize it
router.post('/uploadProfilePicture', authenticate, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileName = `${Date.now()}-${req.file.originalname}`;
    const filePath = path.join(__dirname, '..', 'uploads', fileName);

    // Resize the image to 625x625 using sharp
    await sharp(req.file.buffer)
      .resize(625, 625)
      .toFile(filePath);

    const user = await User.findOne({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const profilePicturePath = `/uploads/${fileName}`;
    user.profilePicture = profilePicturePath;
    await user.save();
    res.json({ profilePicture: `http://localhost:5000${profilePicturePath}` });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove profile picture and set to default
router.post('/removeProfilePicture', authenticate, async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.profilePicture = defaultProfilePicture;
    await user.save();
    res.json({ profilePicture: user.profilePicture });
  } catch (error) {
    console.error('Error removing profile picture:', error);
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
