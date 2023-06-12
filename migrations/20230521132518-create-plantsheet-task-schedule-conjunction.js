'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PlantsheetTaskScheduleConjunctions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      PlantSchedulesId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'PlantSchedules',
          key: 'id'
        }
      },
      PlantsheetTaskConjunctionsId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'PlantsheetTaskConjunctions',
          key: 'id'
        }
      },
      initialDate: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PlantsheetTaskScheduleConjunctions');
  }
};