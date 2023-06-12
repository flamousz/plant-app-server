'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PlantSchedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PlantSchedule.belongsTo(models.PlantSheet, {
        foreignKey: 'PlantsheetId'
      })
      PlantSchedule.belongsTo(models.CropArea,  {
				foreignKey: 'CropAreaId'
			})
      PlantSchedule.hasMany(models.HarvestOutcome)
      PlantSchedule.hasMany(models.SeedNursery)
      PlantSchedule.hasMany(models.PlantsheetTaskScheduleConjunction, {
        foreignKey: 'PlantSchedulesId'
      })
      PlantSchedule.hasMany(models.Notification, {
        foreignKey: 'PlantScheduleId'
      })
    }
  }
  PlantSchedule.init({
    seedlingDate: DataTypes.DATE,
    plantingDate: DataTypes.DATE,
    harvestDate: DataTypes.DATE,
    unloadDate: DataTypes.DATE,
    PlantsheetId: DataTypes.INTEGER,
    CropAreaId: DataTypes.INTEGER,
    totalPopulation: DataTypes.STRING,
    code: DataTypes.STRING,
    seedNursery: DataTypes.INTEGER,
    statusPlantSchedule: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PlantSchedule',
  });
  return PlantSchedule;
};