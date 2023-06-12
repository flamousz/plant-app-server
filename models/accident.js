"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Accident extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
      Accident.belongsTo(models.PlantsheetTaskScheduleConjunction, {
        foreignKey: 'PlantsheetTaskScheduleConjunctionId'
      })
		}
	}
	Accident.init(
		{
			nameAccident: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: "Name cannot be empty",
					},
					notEmpty: {
						msg: "Name cannot be empty",
					},
				},
			},
			descriptionAccident: {
				type: DataTypes.TEXT,
				allowNull: false,
				validate: {
					notNull: {
						msg: "description cannot be empty",
					},
					notEmpty: {
						msg: "description cannot be empty",
					},
				},
			},
			dateAccident: {
				type: DataTypes.DATE,
				allowNull: false,
				validate: {
					notNull: {
						msg: "date cannot be empty",
					},
					notEmpty: {
						msg: "date cannot be empty",
					},
				},
			},
			imageAccident: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: "image cannot be empty",
					},
					notEmpty: {
						msg: "image cannot be empty",
					},
				},
			},
			PlantsheetTaskScheduleConjunctionId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notNull: {
						msg: "id plantschedule cannot be empty",
					},
					notEmpty: {
						msg: "id plantschedule cannot be empty",
					},
				},
			},
		},
		{
			sequelize,
			modelName: "Accident",
		}
	);
	return Accident;
};
