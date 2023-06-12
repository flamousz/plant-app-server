'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PlantSchedules', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      seedlingDate: {
        type: Sequelize.DATE
      },
      plantingDate: {
        type: Sequelize.DATE
      },
      harvestDate: {
        type: Sequelize.DATE
      },
      unloadDate: {
        type: Sequelize.DATE
      },
      PlantsheetId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'PlantSheets',
          key: 'id'
        }
      },
      CropAreaId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'CropAreas',
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
    await queryInterface.dropTable('PlantSchedules');
  }
};