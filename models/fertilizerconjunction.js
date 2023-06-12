'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class fertilizerConjunction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      fertilizerConjunction.belongsTo(models.PlantSheet, {
        foreignKey: 'plantsheetid'
      })
      fertilizerConjunction.belongsTo(models.Item, {
        foreignKey: 'fertilizerid'
      })
    }
  }
  fertilizerConjunction.init({
    plantsheetid: DataTypes.INTEGER,
    fertilizerid: DataTypes.INTEGER,
    dose: DataTypes.FLOAT,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'fertilizerConjunction',
  });
  return fertilizerConjunction;
};