const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('travel_platform_dev', 'postgres', 'vraj2003', {
  host: 'localhost',
  dialect: 'postgres', // or 'mysql' or any other supported dialect
  logging: false,
});

module.exports = sequelize;
