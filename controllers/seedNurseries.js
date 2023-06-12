const {
	SeedNursery,
	PlantSchedule,
	PlantSheet,
	Item,
	fertilizerConjunction,
	PesticideConjunction,
	materialConjunction,
	Uom,
	Category
} = require("../models/index");

class seedNurseriesController {
	static async patchSeedId(req, res, next) {
		try {
			const { id, SeedId } = req.body;
			console.log(id, SeedId, "<<< id, SeedId dari patchSeedId");

			await SeedNursery.update(
				{ SeedId },
				{
					where: { id },
				}
			);

			res.status(200).json("Brand of seed successfully updated");
		} catch (error) {
			console.log(error);
			next(error);
		}
	}

	static async getSeedNurseries(req, res, next) {
		try {
			const opt = {
				include: [
					{
						model: PlantSchedule,
						include: {
							model: PlantSheet,
							include: {
								model: Item,
								as: "plant",
								attributes: ["name"],
							},
							attributes: ["id"],
						},
						attributes: ["seedlingDate", "plantingDate", "code"],
					},
					{
						model: Item,
						attributes: ["name", "description"],
					},
				],
				attributes: {
					exclude: ["createdAt", "updatedAt", 'PlantScheduleId'],
				},
				order: [["createdAt", "DESC"]],
			};
			const data = await SeedNursery.findAll(opt);
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

	static async getSeedNurseriesById(req, res, next) {
		try {
			const { id } = req.params;

			const opt = {
				include: [
					{
						model: PlantSchedule,
						include: {
							model: PlantSheet,
							include: [
								{
									model: Item,
									as: "plant",
									attributes: ["name"],
								},
								{
									model: fertilizerConjunction,
									attributes: [
										"id",
										"dose",
										"fertilizerid",
										"plantsheetid",
										'type'
									],
									include: {
										model: Item,
										include: [
											{
												model: Uom,
												attributes: ["name"],
											},
										],
									},
									where: {
										type: 'nursery'
									}
								},
								{
									model: PesticideConjunction,
									attributes: [
										"id",
										"dose",
										"pesticideid",
										"plantsheetid",
										'type'
									],
									include: {
										model: Item,
										attributes: [
											"name",
											"standardqty",
											"description",
										],
										include: [
											{
												model: Category,
												attributes: ["name"],
											},
											{
												model: Uom,
												attributes: ["name"],
											}
										],
									},
									where: {
										type: 'nursery'
									}
								},
								{
									model: materialConjunction,
									attributes: [
										"id",
										"dose",
										"materialid",
										"plantsheetid",
										'type'
									],
									include: {
										model: Item,
										attributes: [
											"name",
											"standardqty",
											"description",
										],
										include: [
											{
												model: Uom,
												attributes: ["name"],
											},
										],
									},
									where: {
										type: 'nursery'
									}
								},
							],
						},
						attributes: [
							"id",
							"seedlingDate",
							"plantingDate",
							"code",
							"statusPlantSchedule",
							"seedNursery",
							"totalPopulation"
						],
					},
					{
						model: Item,
						attributes: ["name", "description"],
					},
				],
				attributes: {
					exclude: ['createdAt', 'updatedAt']
				}
			};

			const data = await SeedNursery.findByPk(id, opt);

			res.status(200).json(data)
		} catch (error) {
			console.log(error);
			next(error);
		}
	}
}

module.exports = seedNurseriesController;
