'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.removeColumn('PlantSchedules', 'status', {})
  },

  async down (queryInterface, Sequelize) {
    queryInterface.addColumn('PlantSchedules', 'status', {
      type: Sequelize.STRING
    } )
  }
};
