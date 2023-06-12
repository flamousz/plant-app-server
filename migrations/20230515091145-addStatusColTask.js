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
    queryInterface.addColumn('Tasks', 'status', {
      type: Sequelize.STRING
    } )
    queryInterface.addColumn('Tasks', 'arcStatus', {
      type: Sequelize.STRING
    } )
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    
    queryInterface.removeColumn('Tasks', 'status', {})
    queryInterface.removeColumn('Tasks', 'arcStatus', {})
  }
};
