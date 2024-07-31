'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Posts', 'imageUrl', 'imageFile');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Posts', 'imageFile', 'imageUrl');
  }
};
