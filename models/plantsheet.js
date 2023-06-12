"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class PlantSheet extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			PlantSheet.belongsTo(models.Item, {
				foreignKey: "plantid",
				as: "plant",
			});
			PlantSheet.belongsTo(models.PlantType, {
				foreignKey: 'planttypeid'
			})
			PlantSheet.hasMany(models.PlantSchedule, {
				foreignKey: 'PlantsheetId'
			})
			PlantSheet.hasMany(models.materialConjunction, {
				foreignKey: 'plantsheetid'
			})
			PlantSheet.hasMany(models.PesticideConjunction, {
				foreignKey: 'plantsheetid'
			})
			PlantSheet.hasMany(models.SeedConjunction, {
				foreignKey: 'plantsheetid'
			})
			PlantSheet.hasMany(models.fertilizerConjunction, {
				foreignKey: 'plantsheetid'
			})
			PlantSheet.hasMany(models.PlantsheetTaskConjunction)
		}
	}
	PlantSheet.init(
		{
			seedlingAge: DataTypes.INTEGER,
			harvestAge: DataTypes.INTEGER,
			harvestTime: DataTypes.INTEGER,
			cropAge: DataTypes.INTEGER,
			cropProdWeight: DataTypes.NUMERIC,
			planttypeid: DataTypes.INTEGER,
			plantid: DataTypes.INTEGER,
			status: DataTypes.STRING,
			arcStatus: DataTypes.STRING,
			plantPerMetre: DataTypes.INTEGER,
			fallacyNursery: DataTypes.FLOAT
		},
		{
			sequelize,
			modelName: "PlantSheet",
		}
	);
	return PlantSheet;
};
