const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./index').sequelize;

// Define the User model
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // Username must be unique
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false // Password is required
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true // Bio is optional
  },
  profilePicture: {
    type: DataTypes.STRING,
    allowNull: true // Profile picture URL is optional
  },
  travelHistory: {
    type: DataTypes.JSON,
    allowNull: true // Travel history is optional
  }
});

module.exports = User; // Export the User model
