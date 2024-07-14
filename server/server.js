const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const config = require('./config/config.json')['development'];

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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

// Define routes
app.get('/', (req, res) => {
  res.send('Hello, Travel Enthusiasts Platform API!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
