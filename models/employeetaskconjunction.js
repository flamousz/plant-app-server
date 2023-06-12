"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class EmployeeTaskConjunction extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			EmployeeTaskConjunction.belongsTo(models.Employee, {
				foreignKey: "EmployeeId",
				as: "employee",
			});
			EmployeeTaskConjunction.hasMany(models.EmployeeTaskPlantsheettaskScheduleConjunction, {
				foreignKey: 'EmployeeTaskConjunctionId',
				as: 'employeecon'
			})
		}
	}
	EmployeeTaskConjunction.init(
		{
			workingDate: {
				type: DataTypes.DATE,
				allowNull: {
					msg: "Working Date cannot be empty",
				},
			},
			EmployeeId: {
				type: DataTypes.INTEGER,
				allowNull: {
					msg: "Employee Id cannot be empty",
				},
			},
			workMinuteQuota: {
				type: DataTypes.FLOAT,
				allowNull: {
					msg: "Work Minute Quota cannot be empty",
				},
			},
			offDay: {
				type: DataTypes.BOOLEAN,
			},
			workingTimeLog: {
				type: DataTypes.TEXT
			}
		},
		{
			sequelize,
			modelName: "EmployeeTaskConjunction",
		}
	);
	return EmployeeTaskConjunction;
};
