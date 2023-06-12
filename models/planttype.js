'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PlantType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PlantType.hasMany(models.PlantData, {
        foreignKey: 'planttypeid'
      })
      PlantType.hasMany(models.PlantSheet, {
        foreignKey: 'planttypeid'
      })
    }
  }
  PlantType.init({
    name: DataTypes.STRING,
    code: {
      type: DataTypes.STRING,
      unique: {
        msg: "Code has been exists",
      },
    },
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PlantType',
  });
  return PlantType;
};