const { Sequelize } = require('sequelize');
const config = require('../config/config.json')['development'];

// Initialize Sequelize with database configuration
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db; // Export the database connection
