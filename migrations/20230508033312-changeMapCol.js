'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('CropAreas', 'map', {
      type: Sequelize.TEXT,
      unique: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('CropAreas', 'map', {
      type: Sequelize.STRING,
    });
  }
};
