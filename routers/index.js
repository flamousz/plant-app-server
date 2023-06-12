const express = require("express");
const { authentication } = require("../middlewares/auth");

const userRouter = require("./user");
const employeeRouter = require("./employee");
const cropAreRouter = require("./cropArea");
const categoryRouter = require("./category");
const uomRouter = require("./uom");
const plantTypeRouter = require("./plantType");
const itemRouter = require("./item");
const plantDataRouter = require("./plantData");
const plantSheetRouter = require("./plantSheet");
const plantScheduleRouter = require("./plantSchedule");
const harvestOutcomeRouter = require("./harvestOutcome");
const seedNurseriesRouter = require("./seedNurseries");
const taskRouter = require("./task");
const router = express.Router();
const {
	EmployeeTaskConjunction,
	Employee,
	TaskConjunction,
	Task,
	ApprovalMaster,
	Approval,
	sequelize,
	PlantSchedule,
	Notification,
	User,
} = require("../models/index");
const { Op } = require("sequelize");
const notificationRouter = require("./notification");
const approvalRouter = require("./approval");
const csvimportexsportRouter = require("./csvimportexsport");




router.use("/", userRouter);
// router.use(authentication)
router.get("/test/approval", async (req, res, next) => {
	let transaction;

	try {
		transaction = await sequelize.transaction();
		const id = 3; // Approval ID
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
			const listMasterSequenceArray = listMasterSequence.map((item) => [
				item.dataValues.sequenceLevel,
				item.dataValues.pronoun,
			]);

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

		await transaction.commit();
	} catch (error) {
		if (transaction) {
			await transaction.rollback();
		}
		next(error);
	}
});
router.get("/test", async (req, res, next) => {
	try {
		const approvalDummy = [
			{ id: 1, sequenceLevel: 1, pronoun: "submitted", userId: 1 },
			{ id: 2, sequenceLevel: 2, pronoun: "approval 1", userId: 2 },
			{ id: 3, sequenceLevel: 3, pronoun: "approval 2", userId: 3 },
			{ id: 4, sequenceLevel: 4, pronoun: "confirm", userId: 4 },
		];
		const opt = {
			include: {
				model: User,
				attributes: ["id", "email"],
			},
			attributes: {
				exclude: ["createdAt", "updatedAt"],
			},
			order: [["sequenceLevel", "ASC"]],
		};
		const initialApproval = await ApprovalMaster.findAll(opt);
		if (!initialApproval) {
			throw { name: "NotFound" };
		}

		// new const with only id
		const initialIDapproval = initialApproval.map((el) => el.id);

		const approvalNotDeletedPlan = approvalDummy.map(el => el.id)

		// filtering choosen delete id from initial id approval and comparing with approval notdeletedplan
		const approvalDeletedPlan = initialIDapproval.filter(el => !approvalNotDeletedPlan.includes(el))

		
		// searching element that not have 'id' key
		const newApprovalWithoutId = approvalDummy.filter(el => !el.hasOwnProperty('id'))

		// searching element that  have 'id' key
		const newApprovalWithId = approvalDummy.filter(el => el.hasOwnProperty('id'))
		if (approvalDeletedPlan.length) {
			for (const el of approvalDeletedPlan) {
				await ApprovalMaster.destroy({
					where: {id:el}
				})
			}
		}
		if (newApprovalWithId.length) {
			for (const el of newApprovalWithId) {
				await ApprovalMaster.update({
					sequenceLevel: el.sequenceLevel,
					pronoun: el.pronoun,
					UserId: el.userId
				}, {
					where: {
						id: el.id
					}
				})
				
			}
		}
		if (newApprovalWithoutId.length) {
			await ApprovalMaster.bulkCreate(newApprovalWithoutId)
		}
		res.status(200).json('approval sequance successfully changed');
	} catch (error) {
		next(error);
	}
	// try {
	// 	const id = 66;
	// 	const opt = {
	// 		include: {
	// 			model: Notification,
	// 			include: {
	// 				model: Approval,
	// 				attributes: ["id", "approvalSequence"],
	// 			},
	// 			attributes: ["id"],
	// 		},
	// 		where: { id },
	// 		attributes: ["id"],
	// 	};

	// 	const plantScheduleFinder = await PlantSchedule.findOne(opt);
	// 	if (plantScheduleFinder.Notifications.length) {
	// 		console.log(true, '<<<<<< perbandingan cari notif');
	// 		const sequencePlantSchedule =
	// 			plantScheduleFinder.Notifications[0].Approvals[0].id;
	// 		console.log(sequencePlantSchedule, "<<<<<<<<< sequencePlantSchedule");
	// 		console.log(typeof sequencePlantSchedule, "<<<<<<<<< typeof sequencePlantSchedule");
	// 	} else {
	// 		console.log(false, '<<<<<< perbandingan cari notif');
	// 	}
	// 	res.status(200).json(plantScheduleFinder)
	// } catch (error) {
	// 	next(error)
	// }

	// try {
	// 	const selectedDate = new Date("2023-05-23");
	// 	const selectedTask = "menyebor";
	// 	const durationTask = 200;
	// 	const selectedStartHour = "2023-05-23T18:11:00";
	// 	const selectedFinishHour = "2023-05-23T19:11:00";
	// 	let availTimeFlag = false;
	// 	const workingTimeLog = [
	// 		["2023-05-23T14:10:00", "2023-05-23T15:40:00"],
	// 		["2023-05-23T15:11:00", "2023-05-23T17:40:00"],
	// 		["2023-05-23T18:11:00", "2023-05-23T23:23:00"],
	// 	];
	// 	const opt = {
	// 		include: {
	// 			model: Employee,
	// 			as: "employee",
	// 			include: {
	// 				model: TaskConjunction,
	// 				as: "taskConjunction",
	// 				include: {
	// 					model: Task,
	// 					as: "task",
	// 					attributes: ["id", "name"],
	// 				},
	// 				attributes: ["EmployeeId", "TaskId"],
	// 			},
	// 			attributes: ["id", "name"],
	// 		},
	// 		where: {
	// 			[Op.and]: [
	// 				{
	// 					workingDate: selectedDate,
	// 				},
	// 				{
	// 					"$employee.taskConjunction.task.name$": selectedTask,
	// 				},
	// 				{
	// 					offDay: false,
	// 				},
	// 				{
	// 					workMinuteQuota: {
	// 						[Op.gte]: durationTask,
	// 					},
	// 				},
	// 			],
	// 		},
	// 		attributes: [
	// 			"id",
	// 			"workingDate",
	// 			"workMinuteQuota",
	// 			"offDay",
	// 			"workingTimeLog",
	// 		],
	// 		order: [["workingDate", "ASC"]],
	// 	};

	// 	const data = await EmployeeTaskConjunction.findAll(opt);
	// 	if (!data) {
	// 		throw {
	// 			name: "NotFound",
	// 		};
	// 	}
	// 	res.status(200).json(data);
	// } catch (error) {
	// 	console.log(error);
	// 	next(error);
	// }
});
router.get("/test/task", async (req, res, next) => {
	try {
		const employeeTaskConjunctionId = 55;
		const startTime = "2023-05-23T03:11:00"; // universal date format
		const finishTime = "2023-05-23T04:23:00";

		// Update the EmployeeTaskConjunction entry
		const employeeTaskConjunction = await EmployeeTaskConjunction.findByPk(
			employeeTaskConjunctionId
		);

		// Retrieve the existing workingTimeLog array from the EmployeeTaskConjunction
		let existingAvailableTime = employeeTaskConjunction.workingTimeLog || [];
		console.log(
			existingAvailableTime,
			"<< existingAvailableTime sebelum diparse"
		);
		console.log(
			typeof existingAvailableTime,
			"<<typeof existingAvailableTime sebelum diparse"
		);

		// Convert the existingAvailableTime to an array if it's a string
		if (typeof existingAvailableTime === "string") {
			existingAvailableTime = JSON.parse(existingAvailableTime);
		}

		// Add the new start and finish time values to the array
		const updatedAvailableTime = [
			...existingAvailableTime,
			[startTime, finishTime],
		];
		console.log(updatedAvailableTime, "<< updatedAvailableTime");
		console.log(typeof updatedAvailableTime, "<<typeof updatedAvailableTime");

		// Update the EmployeeTaskConjunction entry with the updated workingTimeLog array
		employeeTaskConjunction.workingTimeLog =
			JSON.stringify(updatedAvailableTime);

		await employeeTaskConjunction.save();

		res.status(200).json("update successfully");
	} catch (error) {
		console.log(error);
		next(error);
	}
});
router.get('/test/user', async(req,res,next) => {
	try {
		const data = await User.findAll({
			include: ApprovalMaster,
			attributes: {
				exclude: ['createdAt', 'updatedAt']
			}
		})
		res.status(200).json(data)
	} catch (error) {
		next(error)
	}
})
router.use('/csv', csvimportexsportRouter)
router.use("/approvals", approvalRouter);
router.use("/notifications", notificationRouter);
router.use("/employees", employeeRouter);
router.use("/cropareas", cropAreRouter);
router.use("/categories", categoryRouter);
router.use("/uoms", uomRouter);
router.use("/planttypes", plantTypeRouter);
router.use("/items", itemRouter);
router.use("/plantdata", plantDataRouter);
router.use("/plantsheet", plantSheetRouter);
router.use("/plantschedule", plantScheduleRouter);
router.use("/harvestoutcome", harvestOutcomeRouter);
router.use("/seednurseries", seedNurseriesRouter);
router.use("/task", taskRouter);

module.exports = router;
