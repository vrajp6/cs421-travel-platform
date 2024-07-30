const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Follow = sequelize.define('Follow', {
  follower_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  following_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Follow;
