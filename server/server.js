const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const config = require('./config/config.json')['development'];
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const postRoutes = require('./routes/posts');
const path = require('path');
const followRoutes = require('./routes/follow');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database setup
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  logging: console.log, // Enable detailed logging
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
const User = require('./models/user');
db.User = User;

// Sync models with the database
db.sequelize.sync({ alter: true }) // Use { alter: true } to avoid dropping data, and create/modify tables
  .then(() => {
    console.log('Database connected and synced');
  })
  .catch(err => {
    console.error('Error connecting to the database', err);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', profileRoutes);
app.use('/api/posts', postRoutes);
app.use('/api', followRoutes);

app.get('/', (req, res) => {
  res.send('Hello, Travel Enthusiasts Platform API!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
