'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('HarvestOutcomes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      PlantScheduleId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'PlantSchedules',
          key: 'id'
        }
      },
      harvestDate: {
        type: Sequelize.DATE
      },
      letterNumber: {
        type: Sequelize.STRING
      },
      harvestWeightEst: {
        type: Sequelize.INTEGER
      },
      harvestWeightReal: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('HarvestOutcomes');
  }
};