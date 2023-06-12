const { PlantType } = require("../models/index");

class PlantTypeController {
	static async getPlantType(req, res, next) {
		try {
			const data = await PlantType.findAll({
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

	static async getPlantTypeById(req, res, next) {
		try {
			const { id } = req.params;
			const data = await PlantType.findByPk(id, {
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

	static async postPlantType(req, res, next) {
		try {
			let { name, code, description } = req.body;

			let data = await PlantType.create({
				name,
				code,
				description,
			});

			res.status(201).json(`${data.name} has been added`);
		} catch (err) {
			next(err);
		}
	}

	static async putPlantType(req, res, next) {
		try {
			let { id } = req.params;
			let { name, code, description } = req.body;
			let findData = await PlantType.findByPk(id);
			if (!findData) {
				throw {
					name: "NotFound",
				};
			}
			await PlantType.update(
				{
					name,
					code,
					description,
				},
				{
					where: { id },
					returning: true,
				}
			);
			res.status(200).json(`${findData.name} updated successfully`);
		} catch (err) {
			next(err);
		}
	}

    static async deletePlantType(req, res, next) {
		try {
			const { id } = req.params;

			let findData = await PlantType.findByPk(id);
			if (!findData) {
				throw {
					name: "NotFound",
				};
			}

			await PlantType.destroy({
				where: { id },
			});

			res.status(200).json(`${findData.name} has been deleted`);
		} catch (err) {
			next(err);
		}
	}
}

module.exports = PlantTypeController;
