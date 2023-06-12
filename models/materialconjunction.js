'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class materialConjunction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      materialConjunction.belongsTo(models.PlantSheet, {
        foreignKey: 'plantsheetid'
      })
      materialConjunction.belongsTo(models.Item, {
        foreignKey: 'materialid'
      })
    }
  }
  
  materialConjunction.init({
    plantsheetid: DataTypes.INTEGER,
    materialid: DataTypes.INTEGER,
    dose: DataTypes.FLOAT,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'materialConjunction',
  });
  return materialConjunction;
};