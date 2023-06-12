const { PlantData, Item, PlantType } = require("../models/index");

class PlantDataController {
	static async getPlantData(req, res, next) {
		try {
			const data = await PlantData.findAll({
				include: [
					{
						model: Item,
						attributes: ["name"],
					},
					{
						model: PlantType,
						attributes: ["name"],
					},
				],
				attributes: {
					exclude: ["createdAt", "updatedAt"],
				},
				order: [["createdAt", "DESC"]],
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

	static async getPlantDataById(req, res, next) {
		try {
			const { id } = req.params;
			const data = await PlantData.findByPk(id, {
				include: [
					{
						model: Item,
						attributes: ["name"],
					},
					{
						model: PlantType,
						attributes: ["name"],
					},
				],
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

	static async postPlantData(req, res, next) {
		try {
			const {
				itemid,
				seedlingAge,
				harvestAge,
				harvestTime,
				cropAge,
				cropProdWeight,
				planttypeid,
			} = req.body;

			await PlantData.create({
				itemid,
				seedlingAge,
				harvestAge,
				harvestTime,
				cropAge,
				cropProdWeight,
				planttypeid,
			});

			res.status(201).json(`successfully added new plant data`);
		} catch (err) {
			console.log(err);
			next(err);
		}
	}

	static async putPlantData(req, res, next) {
		try {
			let { id } = req.params;
			let {
				itemid,
				seedlingAge,
				harvestAge,
				harvestTime,
				cropAge,
				cropProdWeight,
				planttypeid,
			} = req.body;
			let findData = await PlantData.findByPk(id);
			if (!findData) {
				throw {
					name: "NotFound",
				};
			}
			await PlantData.update(
				{
					itemid,
					seedlingAge,
					harvestAge,
					harvestTime,
					cropAge,
					cropProdWeight,
					planttypeid,
				},
				{
					where: { id },
					returning: true,
				}
			);
			res.status(200).json(`updated successfully`);
		} catch (err) {
			next(err);
		}
	}

	static async deletePlantData(req, res, next) {
		try {
			const { id } = req.params;

			let findData = await PlantData.findByPk(id);
			if (!findData) {
				throw {
					name: "NotFound",
				};
			}

			await PlantData.destroy({
				where: { id },
			});

			res.status(200).json(`deleted successfully`);
		} catch (err) {
			next(err);
		}
	}
}

module.exports = PlantDataController;
