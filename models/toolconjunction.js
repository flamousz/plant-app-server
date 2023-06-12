'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ToolConjunction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ToolConjunction.belongsTo(models.Task, {
        foreignKey: 'TaskId'
      })
      ToolConjunction.belongsTo(models.Item, {
        foreignKey: 'ToolId'
      })
    }
  }
  ToolConjunction.init({
    TaskId: {
      type: DataTypes.INTEGER,
      allowNull: {
        msg: "Task Id cannot be empty",
      },
    },
    ToolId: {
      type: DataTypes.INTEGER,
      allowNull: {
        msg: "Tool Id cannot be empty",
      },
    }
  }, {
    sequelize,
    modelName: 'ToolConjunction',
  });
  return ToolConjunction;
};