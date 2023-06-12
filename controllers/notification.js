const { Notification, User, PlantSchedule } = require("../models/index");

class NotificationController {
	static async getNotification(req, res, next) {
		try {
			const opt = {
				// include: [
				// 	{
				// 		model: User,
				// 	},
				// 	{
				// 		model: PlantSchedule,
				// 	},
				// ],
				attributes: {
					exclude: ["createdAt", "updatedAt"],
				},
			};
			const data = await Notification.findAll(opt);
			if (!data) {
				throw { name: "NotFound" };
			}
            res.status(200).json(data)
		} catch (error) {
			next(error);
		}
	}
	static async patchIsReadNotification(req, res, next){
		try {
			console.log(req.body, '<<< ini req body di patchIsReadNotification');
			const {id, isRead} = req.body
			await Notification.update({isRead}, { where: {id}})

			res.status(200).json('successfuly patch isRead to true')
		} catch (error) {
			next(error)
		}
	}
}

module.exports = NotificationController;
