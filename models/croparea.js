"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class CropArea extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			CropArea.hasMany(models.PlantSchedule, {
				foreignKey: 'CropAreaId'
			})
		}
	}
	CropArea.init(
		{
			name: DataTypes.STRING,
			area: DataTypes.INTEGER,
			type: DataTypes.STRING,
			detailplace: DataTypes.STRING,
			map: {
				type: DataTypes.TEXT,
				unique: {
					msg: "Code has been exists",
				},
			},
			status: DataTypes.STRING,
			arcStatus: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "CropArea",
		}
	);
	return CropArea;
};
