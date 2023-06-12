'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('Approvals', 'NotificationId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Notifications',
        key: 'id'
      }
    } )
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('Approvals', 'NotificationId', {})
  }
};
