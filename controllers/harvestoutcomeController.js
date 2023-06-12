const { HarvestOutcome } = require("../models/index");

class HarvestOutcomeController {
	static async getHarvestOutcome(req, res, next) {
		try {
			const data = await HarvestOutcome.findAll();
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

	static async getHarvestOutcomeBySheet(req, res, next) {
		try {
			const { id } = req.params;
			const data = await HarvestOutcome.findAll({
				where: {
					PlantScheduleId: id,
				},
				attributes: {
					exclude: ["createdAt", "updatedAt"],
				},
				order: [['harvestDate', 'ASC']]
			});
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

	static async postHarvestOutcome(req, res, next) {
		try {
			console.log(req.body, '<<<< req.body');
			const {
				PlantScheduleId,
				harvestDate,
				letterNumber,
				harvestWeightEst,
				harvestWeightReal,
			} = req.body;

			await HarvestOutcome.create({
				PlantScheduleId,
				harvestDate,
				letterNumber,
				harvestWeightEst,
				harvestWeightReal,
			});

			res.status(201).json(
				"Successfully added new harvest outcome realization"
			);
		} catch (error) {
			console.log(error);
			next(error);
		}
	}
}

module.exports = HarvestOutcomeController;
