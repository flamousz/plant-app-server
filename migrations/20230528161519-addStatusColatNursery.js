'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('SeedNurseries', 'statusNursery', {
      type: Sequelize.STRING
    } )
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('SeedNurseries', 'statusNursery', {})
  }
};
