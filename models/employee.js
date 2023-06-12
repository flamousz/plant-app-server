"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Employee extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Employee.hasMany(models.TaskConjunction, {
				foreignKey: 'EmployeeId',
				as: 'taskConjunction'
			})
			Employee.hasMany(models.EmployeeTaskConjunction, {
				foreignKey: 'EmployeeId',
				as: 'employee'
			})
		}
	}
	Employee.init(
		{
			nik: DataTypes.INTEGER,
			name: DataTypes.STRING,
			gender: DataTypes.STRING,
			status: DataTypes.STRING,
			arcStatus: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "Employee",
		}
	);
	return Employee;
};
