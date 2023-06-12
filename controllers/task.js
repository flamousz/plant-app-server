const {
	Task,
	ToolConjunction,
	Item,
	sequelize,
	PlantsheetTaskScheduleConjunction,
	PlantSchedule,
	PlantsheetTaskConjunction,
	PlantSheet,
	CropArea,
	EmployeeTaskPlantsheettaskScheduleConjunction,
	EmployeeTaskConjunction,
	Employee,
	Accident,
} = require("../models/index");
const { Op } = require("sequelize");

class TaskController {
	static opt = {
		include: [
			{
				model:Accident,
				attributes: {
					exclude: ['createdAt', 'updatedAt']
				}
			},
			{
				model: EmployeeTaskPlantsheettaskScheduleConjunction,
				include: {
					model: EmployeeTaskConjunction,
					as: "employeecon",
					include: {
						model: Employee,
						as: "employee",
						attributes: ["name"],
					},
				},
				attributes: ["id"],
			},
			{
				model: PlantSchedule,
				include: [
					{
						model: PlantSheet,
						include: {
							model: Item,
							as: "plant",
							attributes: ["name"],
						},
						attributes: ["id"],
					},
					{
						model: CropArea,
						attributes: ["name"],
					},
				],
				attributes: ["id", "code"],
				order: [["code", "ASC"]],
			},
			{
				model: PlantsheetTaskConjunction,
				include: {
					model: Task,
					attributes: ["name"],
				},
				attributes: {
					exclude: ["createdAt", "updatedAt"],
				},
			},
		],
		attributes: {
			exclude: ["updatedAt"],
		},
		order: [["initialDate", "ASC"]],
	};
	static async postTaskSheet(req, res, next) {
		try {
			const {
				startWorkHour,
				finishWorkHour,
				fixedDuration,
				id,
				statusTask,
			} = req.body;
			console.log(req.body, "<<<< ini req.body");

			const data = await PlantsheetTaskScheduleConjunction.findByPk(id);
			if (!data) {
				throw { name: "NotFound" };
			}
			await PlantsheetTaskScheduleConjunction.update(
				{
					startTaskTime: startWorkHour,
					finishTaskTime: finishWorkHour,
					fixedDuration,
					statusTask,
				},
				{
					where: { id },
				}
			);
			res.status(200).json("Task successfully added with time.");
		} catch (error) {
			next(error);
		}
	}
	static async putTaskSheetVerification(req, res, next) {
		try {
			const {
				id,
				statusTask,
				description,
				nameAccident,
				descriptionAccident,
				dateAccident,
				PlantsheetTaskScheduleConjunctionId,
			} = req.body;

			console.log(req.body, "<<<< ini req.body");

			const data = await PlantsheetTaskScheduleConjunction.findByPk(id);
			if (!data) {
				throw { name: "NotFound" };
			}
			if (statusTask) {
				console.log("masuk ke kondisi statusTask");
				await PlantsheetTaskScheduleConjunction.update(
					{
						statusTask,
						description,
						// imageAccident: filename,
					},
					{
						where: { id },
					}
				);
			}
			if (nameAccident) {
				console.log("masuk ke kondisi filename");
				const { filename } = req.file;
				console.log(filename, "<<<< ini filename dari req.file");
				await Accident.create({
					nameAccident,
					descriptionAccident,
					dateAccident,
					PlantsheetTaskScheduleConjunctionId,
					imageAccident: filename,
				});
			}
			res.status(200).json("Task successfully updated");
		} catch (error) {
			next(error);
		}
	}

	static async getTaskSheetById(req, res, next) {
		try {
			const { id } = req.params;
			console.log(id, "<<< ini id dari getTaskById");
			const opt = {
				...TaskController.opt,
				where: { id },
			};

			const data = await PlantsheetTaskScheduleConjunction.findOne(opt);
			if (!data) {
				throw { name: "NotFound" };
			}
			res.status(200).json(data);
		} catch (error) {
			next(error);
		}
	}
	static async getTaskSheet(req, res, next) {
		const filterDate = "initialDate";
		try {
			const { filterPlant, filterLocation, commonDate } = req.query;
			console.log(req.query, "<<< ini req query");
			console.log(commonDate, "<< commonDate");
			console.log(filterDate, "<< filterDate");
			console.log(filterPlant, "<< filterPlant");
			console.log(filterLocation, "<< filterLocation");

			if (
				filterPlant !== "" &&
				typeof filterPlant !== "undefined" &&
				filterLocation !== "" &&
				typeof filterLocation !== "undefined" &&
				commonDate !== "" &&
				typeof commonDate !== "undefined"
			) {
				console.log("masuk ke if 3 perbandingan");
				const query = filterPlant.split(",").map((item) => ({
					[Op.eq]: item,
				}));
				const queryLocation = filterLocation.split(",").map((item) => ({
					[Op.eq]: item,
				}));

				if (commonDate.length > 1) {
					console.log(
						"masuk ke if 3 perbandingan dengan commonDate.length > 1"
					);
					TaskController.opt.where = {
						"$PlantSchedule.statusPlantSchedule$": {
							[Op.or]: {
								[Op.eq]: "confirm",
							},
						},
						"$PlantSchedule.PlantSheet.plant.name$": {
							[Op.or]: query,
						},
						"$PlantSchedule.CropArea.name$": {
							[Op.or]: queryLocation,
						},
						[Op.and]: [
							sequelize.where(
								sequelize.fn("DATE", sequelize.col(filterDate)),
								">=",
								commonDate[0]
							),
							sequelize.where(
								sequelize.fn("DATE", sequelize.col(filterDate)),
								"<=",
								commonDate[1]
							),
						],
					};
				} else {
					console.log(
						"masuk ke if 3 perbandingan dengan commonDate.length < 2"
					);
					TaskController.opt.where = {
						"$PlantSchedule.statusPlantSchedule$": {
							[Op.or]: {
								[Op.eq]: "confirm",
							},
						},
						"$PlantSchedule.PlantSheet.plant.name$": {
							[Op.or]: query,
						},
						"$PlantSchedule.CropArea.name$": {
							[Op.or]: queryLocation,
						},
						[Op.and]: sequelize.where(
							sequelize.fn("DATE", sequelize.col(filterDate)),
							"=",
							commonDate[0]
						),
					};
				}
			} else if (
				filterPlant !== "" &&
				typeof filterPlant !== "undefined" &&
				commonDate !== "" &&
				typeof commonDate !== "undefined"
			) {
				console.log(
					"masuk ke if 2 perbandingan antara filterPlant dan commonDate"
				);
				const query = filterPlant.split(",").map((item) => ({
					[Op.eq]: item,
				}));

				if (commonDate.length > 1) {
					console.log(
						"masuk ke if 2 perbandingan antara filterPlant dan commonDate dengan commonDate.length > 1"
					);
					TaskController.opt.where = {
						"$PlantSchedule.statusPlantSchedule$": {
							[Op.or]: {
								[Op.eq]: "confirm",
							},
						},
						"$PlantSchedule.PlantSheet.plant.name$": {
							[Op.or]: query,
						},
						[Op.and]: [
							sequelize.where(
								sequelize.fn("DATE", sequelize.col(filterDate)),
								">=",
								commonDate[0]
							),
							sequelize.where(
								sequelize.fn("DATE", sequelize.col(filterDate)),
								"<=",
								commonDate[1]
							),
						],
					};
				} else {
					console.log(
						"masuk ke if 2 perbandingan antara filterPlant dan commonDate dengan commonDate.length < 2"
					);
					TaskController.opt.where = {
						"$PlantSchedule.statusPlantSchedule$": {
							[Op.or]: {
								[Op.eq]: "confirm",
							},
						},
						"$PlantSchedule.PlantSheet.plant.name$": {
							[Op.or]: query,
						},
						[Op.and]: sequelize.where(
							sequelize.fn("DATE", sequelize.col(filterDate)),
							"=",
							commonDate[0]
						),
					};
				}
			} else if (
				filterLocation !== "" &&
				typeof filterLocation !== "undefined" &&
				commonDate !== "" &&
				typeof commonDate !== "undefined"
			) {
				console.log(
					"masuk ke if 2 perbandingan antara filterLocation dan commonDate"
				);
				const queryLocation = filterLocation.split(",").map((item) => ({
					[Op.eq]: item,
				}));

				if (commonDate.length > 1) {
					console.log(
						"masuk ke if 2 perbandingan dengan commonDate.length > 1"
					);

					TaskController.opt.where = {
						"$PlantSchedule.statusPlantSchedule$": {
							[Op.or]: {
								[Op.eq]: "confirm",
							},
						},
						"$PlantSchedule.CropArea.name$": {
							[Op.or]: queryLocation,
						},
						[Op.and]: [
							sequelize.where(
								sequelize.fn("DATE", sequelize.col(filterDate)),
								">=",
								commonDate[0]
							),
							sequelize.where(
								sequelize.fn("DATE", sequelize.col(filterDate)),
								"<=",
								commonDate[1]
							),
						],
					};
				} else {
					console.log(
						"masuk ke if 2 perbandingan dengan commonDate.length < 2"
					);
					TaskController.opt.where = {
						"$PlantSchedule.statusPlantSchedule$": {
							[Op.or]: {
								[Op.eq]: "confirm",
							},
						},
						"$PlantSchedule.CropArea.name$": {
							[Op.or]: queryLocation,
						},
						[Op.and]: sequelize.where(
							sequelize.fn("DATE", sequelize.col(filterDate)),
							"=",
							commonDate[0]
						),
					};
				}
			} else if (
				filterPlant !== "" &&
				typeof filterPlant !== "undefined" &&
				filterLocation !== "" &&
				typeof filterLocation !== "undefined"
			) {
				console.log(
					"masuk ke if 2 perbandingan antara filterLocation dan filterPlant"
				);
				const query = filterPlant.split(",").map((item) => ({
					[Op.eq]: item,
				}));

				const queryLocation = filterLocation.split(",").map((item) => ({
					[Op.eq]: item,
				}));
				TaskController.opt.where = {
					"$PlantSchedule.statusPlantSchedule$": {
						[Op.or]: {
							[Op.eq]: "confirm",
						},
					},
					"$PlantSchedule.PlantSheet.plant.name$": {
						[Op.or]: query,
					},
					"$PlantSchedule.CropArea.name$": {
						[Op.or]: queryLocation,
					},
				};
			} else if (
				filterLocation !== "" &&
				typeof filterLocation !== "undefined"
			) {
				console.log("masuk ke perbandingan hanya location");
				const query = filterLocation.split(",").map((item) => ({
					[Op.eq]: item,
				}));
				TaskController.opt.where = {
					"$PlantSchedule.statusPlantSchedule$": {
						[Op.or]: {
							[Op.eq]: "confirm",
						},
					},
					"$PlantSchedule.CropArea.name$": {
						[Op.or]: query,
					},
				};
			} else if (filterPlant !== "" && typeof filterPlant !== "undefined") {
				console.log("masuk ke perbandingan hanya filterPlant");
				const query = filterPlant.split(",").map((item) => ({
					[Op.eq]: item,
				}));
				TaskController.opt.where = {
					"$PlantSchedule.statusPlantSchedule$": {
						[Op.or]: {
							[Op.eq]: "confirm",
						},
					},
					"$PlantSchedule.PlantSheet.plant.name$": {
						[Op.or]: query,
					},
				};
			} else if (
				commonDate !== "" &&
				typeof commonDate !== "undefined" &&
				filterDate !== "" &&
				typeof filterDate !== "undefined"
			) {
				// const query = commonDate.split(",").map((item) => ({
				// 	[Op.eq]: item,
				// }));
				// console.log(query, "<<< INI QUERY");
				console.log("masuk ke perbandingan hanya tanggal");
				console.log(commonDate.length, "<<< INI commonDate.length");
				console.log(commonDate, "<<< INI commonDate original");
				console.log(
					typeof commonDate,
					"<<< typeof commonDate sebelum di convert"
				);

				if (commonDate.length > 1) {
					TaskController.opt.where = {
						"$PlantSchedule.statusPlantSchedule$": {
							[Op.or]: {
								[Op.eq]: "confirm",
							},
						},
						[Op.and]: [
							sequelize.where(
								sequelize.fn("DATE", sequelize.col(filterDate)),
								">=",
								commonDate[0]
							),
							sequelize.where(
								sequelize.fn("DATE", sequelize.col(filterDate)),
								"<=",
								commonDate[1]
							),
						],
					};
				} else {
					TaskController.opt.where = {
						"$PlantSchedule.statusPlantSchedule$": {
							[Op.or]: {
								[Op.eq]: "confirm",
							},
						},
						[Op.and]: sequelize.where(
							sequelize.fn("DATE", sequelize.col(filterDate)),
							"=",
							commonDate[0]
						),
					};
				}
			}

			const data = await PlantsheetTaskScheduleConjunction.findAll(
				TaskController.opt
			);

			if (!data) {
				throw {
					name: "NotFound",
				};
			}
			res.status(200).json(data);
		} catch (error) {
			next(error);
		}
	}

	static async getTask(req, res, next) {
		try {
			const { filter } = req.query;

			const opt = {
				include: {
					model: ToolConjunction,
					include: {
						model: Item,
						attributes: {
							exclude: ["createdAt", "updatedAt"],
						},
						order: [["createdAt", "DESC"]],
					},
					attributes: {
						exclude: ["createdAt", "updatedAt"],
					},
				},
				attributes: {
					exclude: ["createdAt", "updatedAt"],
				},
				order: [["createdAt", "DESC"]],
				where: {
					arcStatus: "avail",
				},
			};

			if (filter !== "" && typeof filter !== "undefined") {
				const query = filter.split(",").map((item) => ({
					[Op.eq]: item,
				}));
				opt.where = {
					arcStatus: { [Op.or]: query },
				};
			}
			const data = await Task.findAll(opt);
			if (!data) {
				throw {
					name: "NotFound",
				};
			}

			res.status(200).json(data);
		} catch (error) {
			console.log(error);
			next(error);
		}
	}

	static async getTaskById(req, res, next) {
		try {
			const { id } = req.params;
			const data = await Task.findByPk(id, {
				include: {
					model: ToolConjunction,
					include: {
						model: Item,
						attributes: {
							exclude: ["createdAt", "updatedAt"],
						},
						order: [["createdAt", "DESC"]],
					},
					attributes: {
						exclude: ["createdAt", "updatedAt"],
					},
					order: [["createdAt", "DESC"]],
				},
				attributes: {
					exclude: ["createdAt", "updatedAt"],
				},
			});
			if (!data) {
				throw {
					name: "NotFound",
				};
			}
			res.status(200).json(data);
		} catch (err) {
			next(err);
		}
	}

	static async postTask(req, res, next) {
		try {
			console.log(req.body, "<<< ini req.body");
			let { name, TaskPerMinute, description, ToolConjunctions } = req.body;

			let status = "draft";
			let arcStatus = "avail";
			const task = await Task.create({
				name,
				TaskPerMinute,
				description,
				status,
				arcStatus,
			});

			ToolConjunctions.forEach((el) => {
				el.TaskId = task.id;
			});
			console.log(ToolConjunctions, "<< toolconjunction");
			if (ToolConjunctions[0].ToolId !== 0) {
				await ToolConjunction.bulkCreate(ToolConjunctions);
			}

			res.status(200).json(`${task.name} has been added`);
		} catch (error) {
			next(error);
		}
	}

	static async putTask(req, res, next) {
		try {
			let { id } = req.params;
			let { name, TaskPerMinute, description, status, ToolConjunctions } =
				req.body;

			const initialTask = await Task.findByPk(id, {
				include: {
					model: ToolConjunction,
					attributes: {
						exclude: ["createdAt", "updatedAt"],
					},
				},
				attributes: {
					exclude: ["createdAt", "updatedAt"],
				},
				order: [["createdAt", "DESC"]],
			});

			const initialIDofTask = initialTask.ToolConjunctions.map(
				(el) => el.id
			);
			const TaskNotDeletedPlan = ToolConjunctions.map((el) => el.id);

			const TaskDeletedPlan = initialIDofTask.filter(
				(el) => !TaskNotDeletedPlan.includes(el)
			);

			// searching element that not have 'id' key
			const newTaskWithoutId = ToolConjunctions.filter(
				(el) => !el.hasOwnProperty("id")
			);

			// searching element that  have 'id' key
			const newTaskWithId = ToolConjunctions.filter((el) =>
				el.hasOwnProperty("id")
			);

			await Task.update(
				{
					name,
					TaskPerMinute,
					description,
					status,
				},
				{
					where: { id },
					returning: true,
				}
			);
			if (TaskDeletedPlan[0]) {
				for (const el of TaskDeletedPlan) {
					await ToolConjunction.destroy({
						where: {
							id: el,
						},
					});
				}
			}
			if (newTaskWithId[0]) {
				for (const el of newTaskWithId) {
					await ToolConjunction.update(
						{
							ToolId: el.ToolId,
						},
						{
							where: {
								id: el.id,
							},
						}
					);
				}
			}

			if (newTaskWithoutId[0]) {
				newTaskWithoutId.forEach((el) => (el.TaskId = id));
				await ToolConjunction.bulkCreate(newTaskWithoutId);
			}
			res.status(200).json(`${name} updated successfully`);
		} catch (err) {
			next(err);
		}
	}

	static async deleteTask(req, res, next) {
		try {
			const { id } = req.params;

			let findData = await Task.findByPk(id);
			if (!findData) {
				throw {
					name: "NotFound",
				};
			}

			await Task.destroy({
				where: { id },
			});

			res.status(200).json(`${findData.name} has been deleted`);
		} catch (err) {
			next(err);
		}
	}

	static async patchArcStatusTask(req, res, next) {
		try {
			console.log(req.body, "<<< ini req.body");
			const { id } = req.params;
			const { arcStatus } = req.body;
			const data = await Task.findByPk(id);
			if (!data) {
				throw {
					name: "NotFound",
				};
			}

			await Task.update(
				{ arcStatus },
				{
					where: { id },
				}
			);

			res.status(200).json("Task status successfully changed ");
		} catch (err) {
			console.log(err);
			next(err);
		}
	}
}

module.exports = TaskController;
