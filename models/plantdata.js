"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class PlantData extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			PlantData.belongsTo(models.Item, {
				foreignKey: "itemid",
			});
			PlantData.belongsTo(models.PlantType, {
				foreignKey: "planttypeid",
			});
		}
	}
	PlantData.init(
		{
			itemid: DataTypes.INTEGER,
			seedlingAge: DataTypes.INTEGER,
			harvestAge: DataTypes.INTEGER,
			harvestTime: DataTypes.INTEGER,
			cropAge: DataTypes.INTEGER,
			cropProdWeight: DataTypes.NUMERIC,
			planttypeid: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "PlantData",
		}
	);
	return PlantData;
};
