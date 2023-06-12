const { Op } = require("sequelize");
const {
	CropArea,
	PlantSchedule,
	PlantSheet,
	Item,
} = require("../models/index");

class CropAreaController {
	static async getAllCropArea(req, res, next) {
		try {
			const opt = {
				include: {
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
					attributes: ["id", "code"],
				},
				where: {
					map: {
						[Op.ne]: null
					}
				},
			};
			const data = await CropArea.findAll(opt);
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

	static async getCropArea(req, res, next) {
		try {
			const { filter, search, page } = req.query;
			console.log(req.query, "<< ini req query");
			let limit = 8;
			let offset = 0;

			const opt = {
				attributes: {
					exclude: ["createdAt", "updatedAt", 'map'],
				},
				order: [["createdAt", "DESC"]],
			};

			if (filter !== "" && typeof filter !== "undefined") {
				const query = filter.split(",").map((item) => ({
					[Op.eq]: item,
				}));
				opt.where = {
					arcStatus: { [Op.or]: query },
				};
			}

			if (search) {
				opt.where = {
					name: { [Op.iLike]: `%${search}%` },
				};
			}
			if (page !== "" && typeof page !== "undefined") {
				offset = page * limit - limit;
				opt.offset = offset;
			}
			opt.limit = limit;

			let data = await CropArea.findAndCountAll(opt);
			if (!data) {
				throw { name: "NotFound" };
			} else {
				res.status(200).json(data);
			}
		} catch (err) {
			console.log(err);
			next(err);
		}
	}

	static async getCropAreaById(req, res, next) {
		try {
			const { id } = req.params;
			const data = await CropArea.findByPk(id, {
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

	static async postCropArea(req, res, next) {
		try {
			let { name, area, type, detailPlace, map } = req.body;
			console.log(map, '<<< ini map masih ada spasi');
			let status = "draft";
			let arcStatus = "avail";
			const flattenedArray = map.replace(/\\n|\s/g, "");
			console.log(flattenedArray, '<<< ini map flattenedArray');
			let data = await CropArea.create({
				status,
				arcStatus,
				name,
				area,
				type,
				detailPlace,
				map: flattenedArray,
			});

			res.status(201).json(`${data.name} has been added`);
		} catch (err) {
			next(err);
		}
	}

	static async putCropArea(req, res, next) {
		try {
			let { id } = req.params;
			let { name, area, type, detailPlace, map, status } = req.body;
			let findData = await CropArea.findByPk(id);
			if (!findData) {
				throw {
					name: "NotFound",
				};
			}
			await CropArea.update(
				{
					name,
					area,
					type,
					detailPlace,
					map,
					status,
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

	static async deleteCropArea(req, res, next) {
		try {
			const { id } = req.params;

			let findData = await CropArea.findByPk(id);
			if (!findData) {
				throw {
					name: "NotFound",
				};
			}

			await CropArea.destroy({
				where: { id },
			});

			res.status(200).json(`${findData.name} has been deleted`);
		} catch (err) {
			next(err);
		}
	}

	static async patchArcStatusCropArea(req, res, next) {
		try {
			console.log(req.body, "<<< ini req.body");
			const { id } = req.params;
			const { arcStatus } = req.body;
			const data = await CropArea.findByPk(id);
			if (!data) {
				throw {
					name: "NotFound",
				};
			}

			await CropArea.update(
				{ arcStatus },
				{
					where: { id },
				}
			);

			res.status(200).json("Crop Area status successfully changed ");
		} catch (err) {
			console.log(err);
			next(err);
		}
	}
}

module.exports = CropAreaController;
