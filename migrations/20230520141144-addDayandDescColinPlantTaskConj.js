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
    queryInterface.addColumn('PlantsheetTaskConjunctions', 'day', {
      type: Sequelize.STRING
    } )
    queryInterface.addColumn('PlantsheetTaskConjunctions', 'description', {
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
    queryInterface.removeColumn('PlantsheetTaskConjunctions', 'day', {})
    queryInterface.removeColumn('PlantsheetTaskConjunctions', 'description', {})
  }
};
