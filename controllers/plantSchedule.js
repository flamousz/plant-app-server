const { Op } = require("sequelize");
const {
	PlantSchedule,
	PlantSheet,
	CropArea,
	Item,
	sequelize,
	HarvestOutcome,
	PlantType,
	SeedConjunction,
	fertilizerConjunction,
	PesticideConjunction,
	materialConjunction,
	Uom,
	Category,
	SeedNursery,
	PlantsheetTaskConjunction,
	Task,
	PlantsheetTaskScheduleConjunction,
	Employee,
	Notification,
	EmployeeTaskConjunction,
	Approval,
	ApprovalMaster,
} = require("../models/index");

class PlantScheduleController {
	static async putCodeSchedule(req, res, next) {
		try {
			const allPlantSchedule = await PlantSchedule.findAll();

			for (const plantSchedule of allPlantSchedule) {
				const uniqueNumber = Math.floor(1000 + Math.random() * 9000);
				const newValue = `non-mush${uniqueNumber}`;

				await PlantSchedule.update(
					{
						code: newValue,
					},
					{
						where: {
							id: plantSchedule.id,
						},
					}
				);
			}

			res.status(200).json("successfully update code column");
		} catch (error) {
			console.log(error);
			next(error);
		}
	}
	static async patchStatusPlantSchedule(req, res, next) {
		let transaction;
		/*
		flow
		rejected Feature:

		-server
		data yang didapat dari client
		-- id
		-- statusFromClient
		if statusFromClient === 'rejected' then 
		- find id plant schedule from Approval table where {id}
		- update plant schedule with status value from statusFromClient
		- update approvalSequence field from Approval table   with null value

		lanjut ketika proses fetching approval di account dengan role yang berbeda
		
		*/
		try {
			transaction = await sequelize.transaction();
			const { id, statusFromClient } = req.body; // Approval ID
			console.log(req.body, "<<<< req.body di patchStatusPlantSchedule");
			const PlantScheduleRaw = await Approval.findOne(
				{
					include: {
						model: Notification,
						attributes: ["id"],
						include: {
							model: PlantSchedule,
							attributes: ["id"],
						},
					},
					where: { id },
					attributes: ["id"],
				},
				{ transaction }
			);
			const PlantScheduleId = PlantScheduleRaw.Notification.PlantSchedule.id;
			console.log(PlantScheduleId, "<< PlantScheduleId");
			console.log(typeof PlantScheduleId, "<< typeof PlantScheduleId");
			if (statusFromClient === "draft") { // fitur reset
				/**
				 * kenapa sequence level harus null?
				 * karna supaya setiap plantschedule yg punya fk di approval tidak masuk ke notifikasi
				 * ketika sequence level = 1 maka status plant schedule itu harus submitted dan masuk ke approval fitur
				 */
				/**
				 * kondisi:
				 * - status plant code = draft
				 * - sequence level dari approve = null
				 */
				const selectedPlantSchedule = await PlantSchedule.findByPk(
					PlantScheduleId,
					{ transaction }
				);
				if (!selectedPlantSchedule) {
					throw { name: "NotFound" };
				}
				await PlantSchedule.update(
					{
						statusPlantSchedule: statusFromClient,
					},
					{
						where: {
							id: PlantScheduleId,
						},
					},
					{ transaction }
				);
			
				res.status(200).json(
					`Plant Shedule status with code ${selectedPlantSchedule.code} has been reset `
				);
			} else if (statusFromClient === "rejected") { // fitur reject
				/**
				 * kondisi:
				 * - status plant code = rejected
				 * - sequence level dari approve = null
				 */
				const selectedPlantSchedule = await PlantSchedule.findByPk(
					PlantScheduleId,
					{ transaction }
				);
				if (!selectedPlantSchedule) {
					throw { name: "NotFound" };
				}
				await PlantSchedule.update(
					{
						statusPlantSchedule: statusFromClient,
					},
					{
						where: {
							id: PlantScheduleId,
						},
					},
					{ transaction }
				);
				await Approval.update(
					{
						approvalSequence: null,
					},
					{
						where: { id },
					},
					{ transaction }
				);
				res.status(200).json(
					`Plant Shedule status with code ${selectedPlantSchedule.code} changed to ${statusFromClient} `
				);
			} else if (statusFromClient === "norejected") {
				const approval = await Approval.findOne(
					{
						attributes: ["approvalSequence"],
						where: { id }, // ini harus dipastikan lagi supaya id nya beneran untuk Approval table
					},
					{ transaction }
				);
				const approvalSequence = approval.get("approvalSequence"); //melihat value approvalSequence dari approval table
				console.log(
					approvalSequence,
					"<<< ini approvalSequence dari selected Approval"
				);
				const dataMax = await ApprovalMaster.max("sequenceLevel", {
					transaction,
				}); //mencari nilai terbesar dari sequence from approvalSequenceMaster
				console.log(
					dataMax,
					"<< ini value terbesar sequenceLevel di ApprovalMaster"
				);
				if (approvalSequence < dataMax) {
					const updatedSequence = approvalSequence + 1;
					await Approval.update(
						{
							approvalSequence: updatedSequence,
						},
						{
							where: { id },
						},
						{ transaction }
					);
					let listMasterSequence = await ApprovalMaster.findAll(
						{
							attributes: ["sequenceLevel", "pronoun"],
						},
						{ transaction }
					);
					const listMasterSequenceArray = listMasterSequence.map(
						(item) => [
							item.dataValues.sequenceLevel,
							item.dataValues.pronoun,
						]
					);

					const matchingItem = listMasterSequenceArray.find(
						(item) => item[0] === updatedSequence
					);

					const matchingPronoun = matchingItem
						? matchingItem[1]
						: "No matching pronoun found";
					console.log(matchingPronoun, "<<< matchingPronoun");
					if (matchingPronoun === "No matching pronoun found") {
						throw { name: "SequenceValueError" };
					} else {
						const selectedPlantSchedule = await PlantSchedule.findByPk(
							PlantScheduleId,
							{ transaction }
						);
						if (!selectedPlantSchedule) {
							throw { name: "NotFound" };
						}
						await PlantSchedule.update(
							{
								statusPlantSchedule: matchingPronoun,
							},
							{
								where: {
									id: PlantScheduleId,
								},
							},
							{ transaction }
						);

						res.status(200).json(
							`Plant Shedule status with code ${selectedPlantSchedule.code} changed to ${matchingPronoun} `
						);
					}
				} else {
					throw {
						name: "SequenceValueError",
					};
				}
			} else {
				throw { name: "NotFound" };
			}

			await transaction.commit();
		} catch (error) {
			if (transaction) {
				await transaction.rollback();
			}
			next(error);
		}
	}

	static async putSchedule(req, res, next) {
		try {
			/*
				
			*/
			console.log(req.body, "<<<<<<< ini req.body dari putSchedule");
			const {
				seedlingDate,
				plantingDate,
				harvestDate,
				unloadDate,
				PlantsheetId,
				CropAreaId,
				totalPopulation,
				id,
				seedNursery,
				userId,
			} = req.body;
			const statusPlantSchedule = "submitted";
			const findData = await PlantSchedule.findByPk(id);
			if (!findData) {
				throw {
					name: "NotFound",
				};
			}
			/**
			 * disini kondisi ketika plant schedule status draft tetapi sudah mempunyai fk di notif table maka jika status draft tapi dia punya fk di notif table maka tidak usah create notif dan approval baru
			 * update sequence yg asalnya null ke 1 didapat dari fk table terkait
			 */
			await PlantSchedule.update(
				{
					seedlingDate,
					plantingDate,
					harvestDate,
					unloadDate,
					PlantsheetId,
					CropAreaId,
					totalPopulation,
					seedNursery,
					statusPlantSchedule,
				},
				{
					where: { id },
					returning: true,
				}
			);
			const opt = {
				include: {
					model: Notification,
					include: {
						model: Approval,
						attributes: ["id", "approvalSequence"],
					},
					attributes: ["id"],
				},
				where: { id },
				attributes: ["id"],
			};
			const plantScheduleFinder = await PlantSchedule.findOne(opt);

			if (plantScheduleFinder.Notifications.length) {
				console.log("masuk ke notif length == true");
				const approvalId =
					plantScheduleFinder.Notifications[0].Approvals[0].id;
				if (!approvalId) {
					throw { name: "NotFound" };
				}
				await Approval.update(
					{
						approvalSequence: 1,
					},
					{
						where: {
							id: approvalId,
						},
					}
				);
			} else {
				console.log("masuk ke notif length == false");
				const description = `new approval with code ${findData.code}`;
				const isRead = false;
				const data = await Notification.create({
					UserId: userId,
					PlantScheduleId: findData.id,
					description,
					isRead,
				});

				await Approval.create({
					NotificationId: data.id,
					approvalSequence: 1,
				});
			}

			res.status(200).json(`Schedule has been validated`);
		} catch (error) {
			console.log();
			next(error);
		}
	}

	static async getScheduleTask(req, res, next) {
		try {
			const { filterPlant, filterLocation, commonDate } = req.query;

			let filterDate = new Date();
			console.log(commonDate, "<< commonDate");
			console.log(filterDate, "<< filterDate");
			console.log(filterPlant, "<< filterPlant");
			console.log(filterLocation, "<< filterLocation");
			const opt = {
				include: [
					{
						model: PlantsheetTaskScheduleConjunction,
						include: {
							model: PlantsheetTaskConjunction,
							include: {
								model: Task,
								attributes: ["name"],
							},
							where: {
								[Op.or]: [
									{
										description: "hst",
									},
									{
										description: "processing",
									},
								],
							},
						},
						attributes: {
							exclude: ["createdAt", "updatedAt"],
						},
					},
					{
						model: PlantSheet,
						include: [
							{
								model: PlantsheetTaskConjunction,
								include: [
									{
										model: Task,
										attributes: [
											"name",
											"TaskPerMinute",
											"description",
										],
									},
									{
										model: Item,
										attributes: ["name", "arcStatus"],
									},
								],
								attributes: [
									"id",
									"PlantSheetId",
									"day",
									"description",
								],
								separate: true,
								where: {
									[Op.or]: [
										{
											description: "hst",
										},
										{
											description: "processing",
										},
									],
								},
								order: [["id", "ASC"]],
							},
							{
								model: Item,
								as: "plant",
								attributes: ["name", "code"],
							},
							{
								model: PlantType,
								attributes: ["name"],
							},
							{
								model: SeedConjunction,
								attributes: ["id", "seedid", "plantsheetid"],
								include: {
									model: Item,
									attributes: ["name", "description", "standardqty"],
								},
							},
							{
								model: fertilizerConjunction,
								attributes: [
									"id",
									"dose",
									"fertilizerid",
									"plantsheetid",
									"type",
								],
								include: {
									model: Item,
									attributes: ["name", "standardqty", "description"],
									include: [
										{
											model: Uom,
											attributes: ["name"],
										},
									],
								},
								where: {
									type: "planting",
								},
							},
							{
								model: PesticideConjunction,
								attributes: [
									"id",
									"dose",
									"pesticideid",
									"plantsheetid",
									"type",
								],
								include: {
									model: Item,
									attributes: ["name", "standardqty", "description"],
									include: [
										{
											model: Uom,
											attributes: ["name"],
										},
										{
											model: Category,
											attributes: ["name"],
										},
									],
								},
								where: {
									type: "planting",
								},
							},
							{
								model: materialConjunction,
								attributes: [
									"id",
									"dose",
									"materialid",
									"plantsheetid",
									"type",
								],
								include: {
									model: Item,
									attributes: ["name", "standardqty", "description"],
									include: [
										{
											model: Uom,
											attributes: ["name"],
										},
									],
								},
								where: {
									type: "planting",
								},
							},
						],
						attributes: {
							exclude: ["createdAt", "updatedAt"],
						},
					},
					{
						model: HarvestOutcome,
						attributes: {
							exclude: ["createdAt", "updatedAt"],
						},
					},
					{
						model: CropArea,
						attributes: {
							exclude: ["createdAt", "updatedAt"],
						},
					},
				],
				attributes: {
					exclude: ["createdAt", "updatedAt"],
				},
			};

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
					opt.where = {
						"$PlantSheet.plant.name$": {
							[Op.or]: query,
						},
						"$CropArea.name$": {
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
					opt.where = {
						"$PlantSheet.plant.name$": {
							[Op.or]: query,
						},
						"$CropArea.name$": {
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
					opt.where = {
						"$PlantSheet.plant.name$": {
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
						"masuk ke if 2 perbandingan antara filterLocation dan commonDate dengan commonDate.length < 2"
					);
					opt.where = {
						"$PlantSheet.plant.name$": {
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

					opt.where = {
						"$CropArea.name$": {
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
					opt.where = {
						"$CropArea.name$": {
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
				opt.where = {
					"$PlantSheet.plant.name$": {
						[Op.or]: query,
					},
					"$CropArea.name$": {
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
				opt.where = {
					"$CropArea.name$": {
						[Op.or]: query,
					},
				};
			} else if (filterPlant !== "" && typeof filterPlant !== "undefined") {
				console.log("masuk ke perbandingan hanya filterPlant");
				const query = filterPlant.split(",").map((item) => ({
					[Op.eq]: item,
				}));
				opt.where = {
					"$PlantSheet.plant.name$": {
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
					opt.where = {
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
					opt.where = {
						[Op.and]: sequelize.where(
							sequelize.fn("DATE", sequelize.col(filterDate)),
							"=",
							commonDate[0]
						),
					};
				}
			}

			const data = await PlantSchedule.findAll(opt);
			// console.log(data[5].dataValues.seedlingDate,'<<< dataValues seedlingDate');
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
	static async getSchedule(req, res, next) {
		try {
			const { filterPlant, filterLocation, commonDate, filterDate } =
				req.query;
			console.log(commonDate, "<< commonDate");
			console.log(filterDate, "<< filterDate");
			console.log(filterPlant, "<< filterPlant");
			console.log(filterLocation, "<< filterLocation");
			const opt = {
				include: [
					{
						model: PlantsheetTaskScheduleConjunction,
						include: {
							model: PlantsheetTaskConjunction,
							include: {
								model: Task,
								attributes: ["name"],
							},
							where: {
								[Op.or]: [
									{
										description: "hst",
									},
									{
										description: "processing",
									},
								],
							},
						},
						attributes: {
							exclude: ["createdAt", "updatedAt"],
						},
					},
					{
						model: PlantSheet,
						include: [
							{
								model: PlantsheetTaskConjunction,
								include: [
									{
										model: Task,
										attributes: [
											"name",
											"TaskPerMinute",
											"description",
										],
									},
									{
										model: Item,
										attributes: ["name", "arcStatus"],
									},
								],
								attributes: [
									"id",
									"PlantSheetId",
									"day",
									"description",
								],
								separate: true,
								where: {
									[Op.or]: [
										{
											description: "hst",
										},
										{
											description: "processing",
										},
									],
								},
								order: [["id", "ASC"]],
							},
							{
								model: Item,
								as: "plant",
								attributes: ["name", "code"],
							},
							{
								model: PlantType,
								attributes: ["name"],
							},
							{
								model: SeedConjunction,
								attributes: ["id", "seedid", "plantsheetid"],
								include: {
									model: Item,
									attributes: ["name", "description", "standardqty"],
								},
							},
							{
								model: fertilizerConjunction,
								attributes: [
									"id",
									"dose",
									"fertilizerid",
									"plantsheetid",
									"type",
								],
								include: {
									model: Item,
									attributes: ["name", "standardqty", "description"],
									include: [
										{
											model: Uom,
											attributes: ["name"],
										},
									],
								},
								where: {
									type: "planting",
								},
							},
							{
								model: PesticideConjunction,
								attributes: [
									"id",
									"dose",
									"pesticideid",
									"plantsheetid",
									"type",
								],
								include: {
									model: Item,
									attributes: ["name", "standardqty", "description"],
									include: [
										{
											model: Uom,
											attributes: ["name"],
										},
										{
											model: Category,
											attributes: ["name"],
										},
									],
								},
								where: {
									type: "planting",
								},
							},
							{
								model: materialConjunction,
								attributes: [
									"id",
									"dose",
									"materialid",
									"plantsheetid",
									"type",
								],
								include: {
									model: Item,
									attributes: ["name", "standardqty", "description"],
									include: [
										{
											model: Uom,
											attributes: ["name"],
										},
									],
								},
								where: {
									type: "planting",
								},
							},
						],
						attributes: {
							exclude: ["createdAt", "updatedAt"],
						},
					},
					{
						model: HarvestOutcome,
						attributes: {
							exclude: ["createdAt", "updatedAt"],
						},
					},
					{
						model: CropArea,
						attributes: {
							exclude: ["createdAt", "updatedAt", 'map', 'status', 'arcStatus'],
						},
					},
				],
				attributes: {
					exclude: ["createdAt", "updatedAt"],
				},
				order: [["createdAt", "DESC"]],
			};

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
					opt.where = {
						"$PlantSheet.plant.name$": {
							[Op.or]: query,
						},
						"$CropArea.name$": {
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
					opt.where = {
						"$PlantSheet.plant.name$": {
							[Op.or]: query,
						},
						"$CropArea.name$": {
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
					opt.where = {
						"$PlantSheet.plant.name$": {
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
						"masuk ke if 2 perbandingan antara filterLocation dan commonDate dengan commonDate.length < 2"
					);
					opt.where = {
						"$PlantSheet.plant.name$": {
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

					opt.where = {
						"$CropArea.name$": {
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
					opt.where = {
						"$CropArea.name$": {
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
				opt.where = {
					"$PlantSheet.plant.name$": {
						[Op.or]: query,
					},
					"$CropArea.name$": {
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
				opt.where = {
					"$CropArea.name$": {
						[Op.or]: query,
					},
				};
			} else if (filterPlant !== "" && typeof filterPlant !== "undefined") {
				console.log("masuk ke perbandingan hanya filterPlant");
				const query = filterPlant.split(",").map((item) => ({
					[Op.eq]: item,
				}));
				opt.where = {
					"$PlantSheet.plant.name$": {
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
					opt.where = {
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
					opt.where = {
						[Op.and]: sequelize.where(
							sequelize.fn("DATE", sequelize.col(filterDate)),
							"=",
							commonDate[0]
						),
					};
				}
				// const oneDay = 24 * 60 * 60 * 1000; // number of milliseconds in a day
				// const newDates = commonDate.map((date) => {
				// 	const oldDate = new Date(date);
				// 	const newDate = new Date(oldDate.getTime() + oneDay);
				// 	return newDate.toISOString();
				// });
			}

			const data = await PlantSchedule.findAll(opt);
			// console.log(data[5].dataValues.seedlingDate,'<<< dataValues seedlingDate');
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

	static async postSchedule(req, res, next) {
		try {
			console.log(req.body, "<< ini req.body");
			let {
				seedlingDate,
				plantingDate,
				harvestDate,
				unloadDate,
				PlantsheetId,
				CropAreaId,
				totalPopulation,
				seedNursery,
			} = req.body;
			const min = 1121;
			const max = 9999;
			const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
			const code = `nonmush-${randomNumber}`;
			const statusPlantSchedule = "draft";
			const statusNursery = "draft";
			seedNursery = Math.ceil(seedNursery);
			console.log(seedNursery, "<<< seedNursery setelah dibulatkan");
			const data = await PlantSchedule.create({
				seedlingDate,
				plantingDate,
				harvestDate,
				unloadDate,
				PlantsheetId,
				CropAreaId,
				totalPopulation,
				code,
				seedNursery,
				statusPlantSchedule,
			});

			await SeedNursery.create({
				PlantScheduleId: data.id,
				statusNursery,
			});

			const taskPlantsheetNursery = await PlantsheetTaskConjunction.findAll({
				where: {
					[Op.and]: [
						{
							description: "hss",
						},
						{ PlantSheetId: PlantsheetId },
					],
				},
			});
			// console.log(taskPlantsheetNursery, "<<< taskPlantsheetNursery");

			const conjunctionsNursery = [];

			// Create conjunction objects with initialDate and corresponding PlantsheetTaskConjunctionsId
			for (let i = 0; i < taskPlantsheetNursery.length; i++) {
				console.log(`masuk ke iterasi dengan index ${i}`);
				const currentDate = new Date(seedlingDate); // Create a new Date object for each iteration
				currentDate.setDate(currentDate.getDate() + i); // Increment the date by i days

				let workMinuteQuota = 0;

				if (currentDate.getDay() === 6) {
					workMinuteQuota = 300;
				} else {
					workMinuteQuota = 420;
				}

				// Retrieve all employees
				const employees = await Employee.findAll();

				for (const employee of employees) {
					const existingConjunction =
						await EmployeeTaskConjunction.findOne({
							where: {
								EmployeeId: employee.id,
								workingDate: currentDate,
							},
						});
					console.log(employee.id, "<<<< employee.id");
					if (!existingConjunction) {
						// Create new EmployeeTaskConjunction if there is no existing row with the same initialDate
						await EmployeeTaskConjunction.create({
							EmployeeId: employee.id,
							workingDate: currentDate,
							workMinuteQuota,
							offDay: false,
						});
					}
				}

				// Retrieve the corresponding CropArea record
				const cropArea = await CropArea.findByPk(CropAreaId);
				const area = cropArea.area;

				// Access the TaskId from the taskPlantsheetNursery object
				const taskId = taskPlantsheetNursery[i].TaskId;

				// Retrieve the corresponding TaskPerMinute value from the Tasks table
				const task = await Task.findByPk(taskId);
				const taskPerMinute = task.TaskPerMinute;

				// Calculate the duration based on the area and taskPerMinute values
				const duration = Math.ceil(area / taskPerMinute);

				const conjunction = {
					initialDate: currentDate,
					PlantSchedulesId: data.id, // PlantSchedulesId available from the created PlantSchedule
					PlantsheetTaskConjunctionsId: taskPlantsheetNursery[i].id,
					duration,
				};
				conjunctionsNursery.push(conjunction);
			}
			// console.log(conjunctionsNursery, "<<< ini conjunctionsNursery");

			// Bulk update the PlantsheetTaskScheduleConjunction table with the initialDate values
			await PlantsheetTaskScheduleConjunction.bulkCreate(
				conjunctionsNursery,
				{
					updateOnDuplicate: ["initialDate"],
				}
			);

			const taskPlantsheet = await PlantsheetTaskConjunction.findAll({
				where: {
					[Op.and]: [
						{
							[Op.or]: [
								{
									description: "hst",
								},
								{
									description: "processing",
								},
							],
						},
						{ PlantSheetId: PlantsheetId },
					],
				},
			});
			// console.log(taskPlantsheet, "<<< taskPlantsheet");

			const conjunctions = [];

			// Create conjunction objects with initialDate and corresponding PlantsheetTaskConjunctionsId
			for (let i = 0; i < taskPlantsheet.length; i++) {
				console.log(`masuk ke iterasi dengan index ${i}`);
				const currentDate = new Date(plantingDate); // Create a new Date object for each iteration
				currentDate.setDate(currentDate.getDate() + i); // Increment the date by i days

				let workMinuteQuota = 0;

				if (currentDate.getDay() === 6) {
					workMinuteQuota = 300;
				} else {
					workMinuteQuota = 420;
				}

				// Retrieve all employees
				const employees = await Employee.findAll();

				for (const employee of employees) {
					// harus dicek lagi disini
					const existingConjunction =
						await EmployeeTaskConjunction.findOne({
							where: {
								EmployeeId: employee.id,
								workingDate: currentDate,
							},
						});
					console.log(employee.id, "<<<< employee.id");
					if (!existingConjunction) {
						// Create new EmployeeTaskConjunction if there is no existing row with the same workingDate
						await EmployeeTaskConjunction.create({
							EmployeeId: employee.id,
							workingDate: currentDate,
							workMinuteQuota,
							offDay: false,
						});
					}
				}

				// Retrieve the corresponding CropArea record
				const cropArea = await CropArea.findByPk(CropAreaId);
				const area = cropArea.area;

				// Access the TaskId from the taskPlantsheet object
				const taskId = taskPlantsheet[i].TaskId;

				// Retrieve the corresponding TaskPerMinute value from the Tasks table
				const task = await Task.findByPk(taskId);
				const taskPerMinute = task.TaskPerMinute;

				// Calculate the duration based on the area and taskPerMinute values
				const duration = Math.ceil(area / taskPerMinute);

				const conjunction = {
					initialDate: currentDate,
					PlantSchedulesId: data.id, // PlantSchedulesId available from the created PlantSchedule
					PlantsheetTaskConjunctionsId: taskPlantsheet[i].id,
					duration,
				};
				conjunctions.push(conjunction);
			}
			console.log(conjunctions, "<<< ini conjunctions");

			// Bulk update the PlantsheetTaskScheduleConjunction table with the initialDate values
			await PlantsheetTaskScheduleConjunction.bulkCreate(conjunctions, {
				updateOnDuplicate: ["initialDate"],
			});
			res.status(201).json("New Plant Schedule successfully added");
		} catch (error) {
			console.log(error);
			next(error);
		}
	}

	static async getScheduleById(req, res, next) {
		try {
			const { id } = req.params;
			const opt = {
				include: [
					{
						model: PlantsheetTaskScheduleConjunction,
						include: {
							model: PlantsheetTaskConjunction,
							include: {
								model: Task,
								attributes: ["name"],
							},
							where: {
								[Op.or]: [
									{
										description: "hst",
									},
									{
										description: "processing",
									},
								],
							},
						},
						attributes: {
							exclude: ["createdAt", "updatedAt"],
						},
					},
					{
						model: PlantSheet,
						include: [
							{
								model: PlantsheetTaskConjunction,
								include: [
									{
										model: Task,
										attributes: [
											"name",
											"TaskPerMinute",
											"description",
										],
									},
									{
										model: Item,
										attributes: ["name", "arcStatus"],
									},
								],
								attributes: [
									"id",
									"PlantSheetId",
									"day",
									"description",
								],
								separate: true,
								where: {
									[Op.or]: [
										{
											description: "hst",
										},
										{
											description: "processing",
										},
									],
								},
								order: [["id", "ASC"]],
							},
							{
								model: Item,
								as: "plant",
								attributes: ["name", "code"],
							},
							{
								model: PlantType,
								attributes: ["name"],
							},
							{
								model: SeedConjunction,
								attributes: ["id", "seedid", "plantsheetid"],
								include: {
									model: Item,
									attributes: ["name", "description", "standardqty"],
								},
							},
							{
								model: fertilizerConjunction,
								attributes: [
									"id",
									"dose",
									"fertilizerid",
									"plantsheetid",
									"type",
								],
								include: {
									model: Item,
									attributes: ["name", "standardqty", "description"],
									include: [
										{
											model: Uom,
											attributes: ["name"],
										},
									],
								},
								where: {
									type: "planting",
								},
							},
							{
								model: PesticideConjunction,
								attributes: [
									"id",
									"dose",
									"pesticideid",
									"plantsheetid",
									"type",
								],
								include: {
									model: Item,
									attributes: ["name", "standardqty", "description"],
									include: [
										{
											model: Uom,
											attributes: ["name"],
										},
										{
											model: Category,
											attributes: ["name"],
										},
									],
								},
								where: {
									type: "planting",
								},
							},
							{
								model: materialConjunction,
								attributes: [
									"id",
									"dose",
									"materialid",
									"plantsheetid",
									"type",
								],
								include: {
									model: Item,
									attributes: ["name", "standardqty", "description"],
									include: [
										{
											model: Uom,
											attributes: ["name"],
										},
									],
								},
								where: {
									type: "planting",
								},
							},
						],
						attributes: {
							exclude: ["createdAt", "updatedAt"],
						},
					},
					{
						model: HarvestOutcome,
						attributes: {
							exclude: ["createdAt", "updatedAt"],
						},
					},
					{
						model: CropArea,
						attributes: {
							exclude: ["createdAt", "updatedAt"],
						},
					},
				],
				attributes: {
					exclude: ["createdAt", "updatedAt"],
				},
			};
			const data = await PlantSchedule.findByPk(id, opt);

			res.status(200).json(data);
		} catch (error) {
			console.log(error);
			next(error);
		}
	}
}

module.exports = PlantScheduleController;
