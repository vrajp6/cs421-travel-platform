const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');  // Make sure this path is correct

const Comment = sequelize.define('Comment', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,  // This links the userId to the User model
      key: 'id'
    }
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

// Define associations
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Comment;
