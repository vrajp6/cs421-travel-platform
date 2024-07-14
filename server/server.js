const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const config = require('./config/config.json')['development'];
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON bodies for this app

// Database setup
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Test database connection and sync models
db.sequelize.sync()
  .then(() => {
    console.log('Database connected and synced');
  })
  .catch(err => {
    console.error('Error connecting to the database', err);
  });

// Routes
app.use('/api/auth', authRoutes); // Routes for user authentication

app.get('/', (req, res) => {
  res.send('Hello, Travel Enthusiasts Platform API!'); // Test route
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
