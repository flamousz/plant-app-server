'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PlantData', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      itemid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Items',
          key: 'id'
        }
      },
      seedlingAge: {
        type: Sequelize.INTEGER
      },
      harvestAge: {
        type: Sequelize.INTEGER
      },
      harvestTime: {
        type: Sequelize.INTEGER
      },
      cropAge: {
        type: Sequelize.INTEGER
      },
      cropProdWeight: {
        type: Sequelize.NUMERIC
      },
      planttypeid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'PlantTypes',
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
    await queryInterface.dropTable('PlantData');
  }
};