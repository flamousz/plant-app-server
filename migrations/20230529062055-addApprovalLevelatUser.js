'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('Users', 'approvalLevel', {
      type: Sequelize.INTEGER,
      defaultValue: 1
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('Users', 'approvalLevel', {})
  }
};
