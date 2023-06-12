"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Task extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Task.hasMany(models.ToolConjunction, {
				foreignKey: "TaskId",
			});
			Task.hasMany(models.TaskConjunction, {
				foreignKey: 'TaskId',
				as: "task",
      })
			Task.hasMany(models.PlantsheetTaskConjunction)
		}
	}
	Task.init(
		{
			name: {
				type: DataTypes.STRING,
				unique: {
					msg: "Task has been exists",
				},
				allowNull: {
					msg: "Task Name cannot be empty",
				},
			},
			TaskPerMinute: {
				type: DataTypes.FLOAT,
				allowNull: {
					msg: "Task Per Minute cannot be empty",
				},
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: {
					msg: "Description cannot be empty",
				},
			},
			status: DataTypes.STRING,
			arcStatus: DataTypes.STRING
		},
		{
			sequelize,
			modelName: "Task",
		}
	);
	return Task;
};
