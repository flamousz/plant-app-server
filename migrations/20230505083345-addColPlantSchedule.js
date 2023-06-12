'use strict';
const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.addColumn('PlantSchedules', 'code', {
      type: DataTypes.STRING
    } )
    queryInterface.addColumn('PlantSchedules', 'status', {
      type: DataTypes.STRING
    } )
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.removeColumn('PlantSchedules', 'code', {})
    queryInterface.removeColumn('PlantSchedules', 'status', {})
  }
};
