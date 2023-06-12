'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EmployeeTaskPlantsheettaskScheduleConjunctions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      EmployeeTaskConjunctionId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'EmployeeTaskConjunctions',
          key: 'id'
        }
      },
      PlantsheetTaskScheduleConjunctionId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'PlantsheetTaskScheduleConjunctions',
          key: 'id'
        }
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
    await queryInterface.dropTable('EmployeeTaskPlantsheettaskScheduleConjunctions');
  }
};