'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.removeColumn('Approvals', 'firstApproval', {})
    queryInterface.removeColumn('Approvals', 'secondApproval', {})
    queryInterface.addColumn('Approvals', 'approvalSequence', {
      type: Sequelize.INTEGER
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.addColumn('Approvals', 'firstApproval', {
      type: Sequelize.STRING
    })
    queryInterface.addColumn('Approvals', 'secondApproval', {
      type: Sequelize.STRING
    })
    queryInterface.removeColumn('Approvals', 'approvalSequence', {})
  }
};
