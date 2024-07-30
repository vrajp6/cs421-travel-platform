const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('travel_platform_dev', 'postgres', 'spvb4829', {
  host: 'localhost',
  dialect: 'postgres', // or 'mysql' or any other supported dialect
  logging: false,
});

module.exports = sequelize;
