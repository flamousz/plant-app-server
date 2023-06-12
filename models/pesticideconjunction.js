'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PesticideConjunction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PesticideConjunction.belongsTo(models.PlantSheet, {
        foreignKey: 'plantsheetid'
      })
      PesticideConjunction.belongsTo(models.Item, {
        foreignKey: 'pesticideid'
      })
    }
  }
  PesticideConjunction.init({
    plantsheetid: DataTypes.INTEGER,
    pesticideid: DataTypes.INTEGER,
    dose: DataTypes.FLOAT,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PesticideConjunction',
  });
  return PesticideConjunction;
};