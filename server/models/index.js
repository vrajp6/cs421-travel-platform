const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Post = require('./post');

const db = {
  User: User,
  sequelize: sequelize,
  Sequelize: Sequelize
};

db.Post = Post;

module.exports = db;
