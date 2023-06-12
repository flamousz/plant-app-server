'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmployeeTaskPlantsheettaskScheduleConjunction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EmployeeTaskPlantsheettaskScheduleConjunction.belongsTo(models.EmployeeTaskConjunction, {
        foreignKey: 'EmployeeTaskConjunctionId',
        as: 'employeecon'
      })
      EmployeeTaskPlantsheettaskScheduleConjunction.belongsTo(models.PlantsheetTaskScheduleConjunction, {
        foreignKey: 'PlantsheetTaskScheduleConjunctionId'
      })
    }
  }
  EmployeeTaskPlantsheettaskScheduleConjunction.init({
    EmployeeTaskConjunctionId: DataTypes.INTEGER,
    PlantsheetTaskScheduleConjunctionId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'EmployeeTaskPlantsheettaskScheduleConjunction',
  });
  return EmployeeTaskPlantsheettaskScheduleConjunction;
};