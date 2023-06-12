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
    queryInterface.addColumn('Tasks', 'PlantsheetId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'PlantSheets',
        key: 'id'
      },
      allowNull: false
    } )
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.removeColumn('Tasks', 'PlantSheetId', {})
  }
};
