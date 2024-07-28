const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Post = sequelize.define('Post', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

// Establish the relationship between User and Post
Post.belongsTo(User, { foreignKey: 'userId' }); // Changed from 'id' to 'userId'
User.hasMany(Post, { foreignKey: 'userId' }); // Changed from 'id' to 'userId'

module.exports = Post;