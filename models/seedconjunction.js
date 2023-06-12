'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SeedConjunction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SeedConjunction.belongsTo(models.PlantSheet, {
        foreignKey: 'plantsheetid'
      })
      SeedConjunction.belongsTo(models.Item, {
        foreignKey: 'seedid'
      })
    }
  }
  SeedConjunction.init({
    plantsheetid: DataTypes.INTEGER,
    seedid: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SeedConjunction',
  });
  return SeedConjunction;
};