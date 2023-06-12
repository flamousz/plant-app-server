'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Accidents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nameAccident: {
        type: Sequelize.STRING,
        allowNull: false
      },
      descriptionAccident: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      dateAccident: {
        type: Sequelize.DATE,
        allowNull: false
      },
      imageAccident: {
        type: Sequelize.STRING,
        allowNull: false
      },
      PlantsheetTaskScheduleConjunctionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable('Accidents');
  }
};