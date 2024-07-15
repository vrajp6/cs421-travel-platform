const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const db = {
  User: User,
  sequelize: sequelize,
  Sequelize: Sequelize
};

module.exports = db;
