const { Op } = require("sequelize");
const { Category } = require("../models/index");

class CategoryController {
	static async getCategory(req, res, next) {
		try {
			const { filter } = req.query;
			const opt = {
				attributes: {
					exclude: ["createdAt", "updatedAt"],
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
			let data = await Category.findAndCountAll(opt);
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

	static async getCategoryById(req, res, next) {
		try {
			const { id } = req.params;
			const data = await Category.findByPk(id, {
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

	static async postCategory(req, res, next) {
		try {
			let { name, description } = req.body;
			let status = "draft";
			let arcStatus = "avail";
			const min = 1121;
			const max = 9999;
			const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

			let code = `${name}${randomNumber}`
			let data = await Category.create({
				name,
				code,
				description,
				status,
				arcStatus,
			});

			res.status(201).json(`${data.name} has been added`);
		} catch (err) {
			next(err);
		}
	}

	static async putCategory(req, res, next) {
		try {
			let { id } = req.params;
			let { name, code, description, status } = req.body;
			let findData = await Category.findByPk(id);
			if (!findData) {
				throw {
					name: "NotFound",
				};
			}
			await Category.update(
				{
					name,
					code,
					description,
					status
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

    static async deleteCategory(req, res, next) {
		try {
			const { id } = req.params;

			let findData = await Category.findByPk(id);
			if (!findData) {
				throw {
					name: "NotFound",
				};
			}

			await Category.destroy({
				where: { id },
			});

			res.status(200).json(`${findData.name} has been deleted`);
		} catch (err) {
			next(err);
		}
	}

	static async patchArcStatusCategory(req, res, next) {
		try {
			console.log(req.body, "<<< ini req.body");
			const { id } = req.params;
			const { arcStatus } = req.body;
			const data = await Category.findByPk(id);
			if (!data) {
				throw {
					name: "NotFound",
				};
			}

			await Category.update(
				{ arcStatus },
				{
					where: { id },
				}
			);

			res.status(200).json("Category status successfully changed ");
		} catch (err) {
			console.log(err);
			next(err);
		}
	}
}

module.exports = CategoryController;
