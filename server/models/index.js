const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Post = require('./post');
const Comment = require('./comment');
const Follow = require('./follow');

User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId' });

Post.hasMany(Comment, { foreignKey: 'postId' });
Comment.belongsTo(Post, { foreignKey: 'postId' });

const db = {
  User: User,
  sequelize: sequelize,
  Sequelize: Sequelize,
  Post: Post,
  Comment: Comment,
  Follow: Follow
};

db.Post = Post;

module.exports = db;