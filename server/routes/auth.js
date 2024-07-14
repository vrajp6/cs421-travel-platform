const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user in the database
    const user = await User.create({ username, password: hashedPassword });
    res.status(201).json(user); // Send the created user as response
  } catch (err) {
    console.error('Error during registration:', err); // Log the error
    res.status(500).json({ error: 'Server error' }); // Handle errors
  }
});

// Login an existing user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      console.log('User not found for username:', username);
      return res.status(400).json({ error: 'Invalid credentials' }); // User not found
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match for username:', username);
      return res.status(400).json({ error: 'Invalid credentials' }); // Password does not match
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token }); // Send the token as response
  } catch (err) {
    console.error('Error during login:', err); // Log the error
    res.status(500).json({ error: 'Server error' }); // Handle errors
  }
});

module.exports = router; // Export the router
