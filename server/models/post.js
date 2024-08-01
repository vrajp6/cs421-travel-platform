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
  imageFile: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

Post.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Post, { foreignKey: 'userId' });

// Define a many-to-many relationship for likes
Post.belongsToMany(User, { through: 'PostLikes', as: 'likedBy', foreignKey: 'postId' });
User.belongsToMany(Post, { through: 'PostLikes', as: 'likedPosts', foreignKey: 'userId' });

module.exports = Post;
