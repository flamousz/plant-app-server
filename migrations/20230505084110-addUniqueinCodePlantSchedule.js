'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('PlantSchedules', 'code', {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('PlantSchedules', 'code', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
