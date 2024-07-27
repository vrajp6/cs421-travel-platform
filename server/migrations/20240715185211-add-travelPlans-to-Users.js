'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('Users');
    if (!table.travelPlans) {
      await queryInterface.addColumn('Users', 'travelPlans', {
        type: Sequelize.JSON,
        allowNull: true
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('Users');
    if (table.travelPlans) {
      await queryInterface.removeColumn('Users', 'travelPlans');
    }
  }
};

