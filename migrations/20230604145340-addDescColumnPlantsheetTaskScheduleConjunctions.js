'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('PlantsheetTaskScheduleConjunctions', 'description', {
      type: Sequelize.TEXT,
    })
    queryInterface.addColumn('PlantsheetTaskScheduleConjunctions', 'imageAccident', {
      type: Sequelize.STRING,
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('PlantsheetTaskScheduleConjunctions', 'description', {})
    queryInterface.removeColumn('PlantsheetTaskScheduleConjunctions', 'imageAccident', {})
  }
};
