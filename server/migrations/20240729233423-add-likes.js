'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Posts', 'likes', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Posts', 'likes');
  }
};