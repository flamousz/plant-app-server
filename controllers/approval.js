const {
	Approval,
	Notification,
	PlantSchedule,
	User,
	Item,
	PlantSheet,
	ApprovalMaster,
	sequelize
} = require("../models/index");

class ApprovalController {
	static opt = {
		include: {
			model: Notification,
			include: [
				{
					model: PlantSchedule,
					include: {
						model: PlantSheet,
						include: {
							model: Item,
							as: "plant",
							attributes: ["name", "id"],
						},
						attributes: ["id"],
					},
					attributes: ["id", "code", "statusPlantSchedule"],
				},
				{
					model: User,
					attributes: ["email"],
				},
			],
			attributes: ["id", "description", "isRead"],
		},
		attributes: {
			exclude: ["createdAt", "updatedAt"],
		},
	};
	static async getAllRejectedApproval(req, res, next) {
		try {
			console.log("masuk getAllRejectedApproval di server");
			ApprovalController.opt.where = {
				"$Notification.PlantSchedule.statusPlantSchedule$": 'rejected'
			}
			const data = await Approval.findAll(ApprovalController.opt)
			if (!data) {
				throw{name: 'NotFound'}
			}
			res.status(200).json(data)
		} catch (error) {
			next(error);
		}
	}

	static async getAllApproval(req, res, next) {
		try {
			console.log("masuk getAllApproval di server");
			console.log(req.body, "<<< req body di getAllApproval");
			const { approvalSequence } = req.body;
			ApprovalController.opt.where = { approvalSequence };
			const data = await Approval.findAll(ApprovalController.opt);
			if (!data) {
				throw { name: "NotFound" };
			}
			res.status(200).json(data);
		} catch (error) {
			next(error);
		}
	}

	static async getAllApprovalMaster(req, res, next){
		/**
		 * data yang ditampilkan di client 
		 * - no
		 * - sequenceLevel
		 * - pronoun
		 * - User.email
		 */
		try {
			const opt = {
				include: {
					model: User,
					attributes:['id', 'email']
				},
				attributes: {
					exclude: ['createdAt', 'updatedAt']
				},
				order: [['sequenceLevel', 'ASC']]
			}
			const data = await ApprovalMaster.findAll(opt)
			if (!data) {
				throw{name: 'NotFound'}
			}
			res.status(200).json(data)
		} catch (error) {
			next(error)
		}
	}
	static async putApprovalMaster(req, res, next){
		let transaction
		try {

			transaction = await sequelize.transaction()
			console.log(req.body, '<<< req.body putApprovalMaster ');
			const approvalData = req.body
			console.log(approvalData,'<<<< approvalData');
			approvalData.forEach(el => {
				delete el.User
			})
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
			const initialApproval = await ApprovalMaster.findAll(opt, {transaction});
			if (!initialApproval) {
				throw { name: "NotFound" };
			}
	
			// new const with only id
			const initialIDapproval = initialApproval.map((el) => el.id);
	
			const approvalNotDeletedPlan = approvalData.map(el => el.id)
	
			// filtering choosen delete id from initial id approval and comparing with approval notdeletedplan
			const approvalDeletedPlan = initialIDapproval.filter(el => !approvalNotDeletedPlan.includes(el))
	
			
			// searching element that not have 'id' key
			const newApprovalWithoutId = approvalData.filter(el => !el.hasOwnProperty('id'))
	
			// searching element that  have 'id' key
			const newApprovalWithId = approvalData.filter(el => el.hasOwnProperty('id'))
			if (approvalDeletedPlan.length) {
				for (const el of approvalDeletedPlan) {
					await ApprovalMaster.destroy({
						where: {id:el}
					}, {transaction})
				}
			}
			if (newApprovalWithId.length) {
				for (const el of newApprovalWithId) {
					await ApprovalMaster.update({
						sequenceLevel: el.sequenceLevel,
						pronoun: el.pronoun,
						UserId: el.UserId
					}, {
						where: {
							id: el.id
						}
					}, {transaction})
					
				}
			}
			if (newApprovalWithoutId.length) {
				await ApprovalMaster.bulkCreate(newApprovalWithoutId, {transaction})
			}

			await transaction.commit()
			res.status(200).json('approval sequance successfully changed');
		} catch (error) {
			if (transaction) {
				await transaction.rollback()
			}
			next(error)
		}
	}
}

module.exports = ApprovalController;
