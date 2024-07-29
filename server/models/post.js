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
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  }
}, {
  timestamps: true
});

Post.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Post, { foreignKey: 'userId' });

module.exports = Post;