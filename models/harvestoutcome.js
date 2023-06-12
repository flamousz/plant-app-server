'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HarvestOutcome extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      HarvestOutcome.belongsTo(models.PlantSchedule)
    }
  }
  HarvestOutcome.init({
    PlantScheduleId: DataTypes.INTEGER,
    harvestDate: DataTypes.DATE,
    letterNumber: DataTypes.STRING,
    harvestWeightEst: DataTypes.INTEGER,
    harvestWeightReal: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'HarvestOutcome',
  });
  return HarvestOutcome;
};