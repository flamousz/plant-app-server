'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.removeColumn('Users', 'ApprovalMasterId', {})
    queryInterface.addColumn('ApprovalMasters', 'UserId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.addColumn('Users', 'ApprovalMasterId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'ApprovalMasters',
        key: 'id'
      }
    })
    queryInterface.removeColumn('ApprovalMasters', 'UserId', {})
  }
};
