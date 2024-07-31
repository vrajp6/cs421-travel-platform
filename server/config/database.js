const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('travel_platform_dev', 'postgres', 'slyfox2708', {
  host: 'localhost',
  dialect: 'postgres', // or 'mysql' or any other supported dialect
  logging: false,
});

module.exports = sequelize;
