'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PlantsheetTaskConjunction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PlantsheetTaskConjunction.belongsTo(models.Item)
      PlantsheetTaskConjunction.belongsTo(models.Task)
      PlantsheetTaskConjunction.belongsTo(models.PlantSheet)
      PlantsheetTaskConjunction.hasMany(models.PlantsheetTaskScheduleConjunction, {
        foreignKey: 'PlantsheetTaskConjunctionsId'
      })
    }
  }
  PlantsheetTaskConjunction.init({
    PlantSheetId: DataTypes.INTEGER,
    TaskId: DataTypes.INTEGER,
    ItemId: DataTypes.INTEGER,
    day: DataTypes.STRING,
    description: DataTypes.STRING,
    date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'PlantsheetTaskConjunction',
  });
  return PlantsheetTaskConjunction;
};