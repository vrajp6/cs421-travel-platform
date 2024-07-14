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
  }
});

module.exports = User; // Export the User model
