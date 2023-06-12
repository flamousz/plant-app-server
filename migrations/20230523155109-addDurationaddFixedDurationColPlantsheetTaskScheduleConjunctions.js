'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('PlantsheetTaskScheduleConjunctions', 'duration', {
      type: Sequelize.INTEGER
    } )
    queryInterface.addColumn('PlantsheetTaskScheduleConjunctions', 'fixedDuration', {
      type: Sequelize.INTEGER
    } )
    queryInterface.addColumn('PlantsheetTaskScheduleConjunctions', 'startTaskTime', {
      type: Sequelize.DATE
    } )
    queryInterface.addColumn('PlantsheetTaskScheduleConjunctions', 'finishTaskTime', {
      type: Sequelize.DATE
    } )


  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('PlantsheetTaskScheduleConjunctions', 'duration', {})
    queryInterface.removeColumn('PlantsheetTaskScheduleConjunctions', 'fixedDuration', {})
    queryInterface.removeColumn('PlantsheetTaskScheduleConjunctions', 'startTaskTime', {})
    queryInterface.removeColumn('PlantsheetTaskScheduleConjunctions', 'finishTaskTime', {})
  }
};
