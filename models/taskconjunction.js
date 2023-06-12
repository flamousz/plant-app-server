'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TaskConjunction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TaskConjunction.belongsTo(models.Employee, {
        foreignKey: 'EmployeeId',
        as: 'taskConjunction'
      })
      TaskConjunction.belongsTo(models.Task, {
        foreignKey: 'TaskId',
				as: "task",
      })
    }
  }
  TaskConjunction.init({
    EmployeeId: {
      type: DataTypes.INTEGER,
      allowNull: {
        msg: 'Employee Id cannot be empty'
      }
    },
    TaskId: {
      type: DataTypes.INTEGER,
      allowNull: {
        msg: 'Task Id cannot be empty'
      }
    }
  }, {
    sequelize,
    modelName: 'TaskConjunction',
  });
  return TaskConjunction;
};