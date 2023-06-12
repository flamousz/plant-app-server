'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PlantsheetTaskScheduleConjunction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PlantsheetTaskScheduleConjunction.belongsTo(models.PlantSchedule, {
        foreignKey: 'PlantSchedulesId'
      })
      PlantsheetTaskScheduleConjunction.belongsTo(models.PlantsheetTaskConjunction, {
        foreignKey: 'PlantsheetTaskConjunctionsId'
      })
      PlantsheetTaskScheduleConjunction.hasMany(models.EmployeeTaskPlantsheettaskScheduleConjunction, {
        foreignKey: 'PlantsheetTaskScheduleConjunctionId'
      })
      PlantsheetTaskScheduleConjunction.hasMany(models.Accident, {
        foreignKey: 'PlantsheetTaskScheduleConjunctionId'
      })
    }
  }
  PlantsheetTaskScheduleConjunction.init({
    PlantSchedulesId: DataTypes.INTEGER,
    PlantsheetTaskConjunctionsId: DataTypes.INTEGER,
    initialDate: DataTypes.DATE,
    duration: DataTypes.INTEGER,
    fixedDuration: DataTypes.INTEGER,
    startTaskTime: DataTypes.DATE,
    finishTaskTime: DataTypes.DATE,
    statusTask: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'PlantsheetTaskScheduleConjunction',
  });
  return PlantsheetTaskScheduleConjunction;
};