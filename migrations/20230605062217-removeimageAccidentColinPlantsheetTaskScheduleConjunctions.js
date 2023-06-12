'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.removeColumn('PlantsheetTaskScheduleConjunctions', 'imageAccident', {})
  },

  async down (queryInterface, Sequelize) {
    queryInterface.addColumn('PlantsheetTaskScheduleConjunctions', 'imageAccident', {
      type: Sequelize.STRING,
    })
  }
};
