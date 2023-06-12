'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('PlantsheetTaskScheduleConjunctions', 'statusTask', {
      type: Sequelize.STRING,
      defaultValue: 'no employee'
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('PlantsheetTaskScheduleConjunctions', 'statusTask', {})
  }
};
