'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'travelHistory', {
      type: Sequelize.JSONB,
      allowNull: true
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'travelHistory', {
      type: Sequelize.JSON,
      allowNull: true
    });
  }
};
