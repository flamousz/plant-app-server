const { Op } = require("sequelize");
const { Item, Category, Uom } = require("../models/index");

class ItemController {
	static async patchArcStatusItem(req, res, next) {
		try {
			console.log(req.body, "<<< ini req.body");
			const { id } = req.params;
			const { arcStatus } = req.body;
			const data = await Item.findByPk(id);
			if (!data) {
				throw {
					name: "NotFound",
				};
			}

			await Item.update(
				{ arcStatus },
				{
					where: { id },
				}
			);

			res.status(200).json("Item status successfully changed ");
		} catch (err) {
			console.log(err);
			next(err);
		}
	}

	static async getToolItem(req, res, next){
		try {
			const opt = {
				where: {
					categoryid: 12
				},
				attributes: ['name', 'id'],
				order: [['name', 'DESC']]
			}

			const data = await Item.findAll(opt)
			if (!data) {
				throw{
					name: 'NotFound'
				}
			}
			res.status(200).json(data)
		} catch (error) {
			console.log(error);
			next(error)
		}
	}

	static async getItemAllPesticide(req, res, next) {
		try {
			const data = await Item.findAll({
				where: {
					[Op.or]: [
						{ categoryid: 3 },
						{ categoryid: 4 },
						{ categoryid: 5 },
						{ categoryid: 6 },
					],
				},
				attributes: ["name", "id"],
				order: [["createdAt", "DESC"]],
			});
			if (!data) {
				throw {
					name: "NotFound",
				};
			}
			res.status(200).json(data);
		} catch (err) {
			console.log(err);
		}
	}

	static async getItemPesticidesFungi(req, res, next) {
		try {
			const data = await Item.findAll({
				where: { categoryid: 3 },
				attributes: ["name", "id"],
				order: [["createdAt", "DESC"]],
			});
			if (!data) {
				throw {
					name: "NotFound",
				};
			}
			res.status(200).json(data);
		} catch (err) {
			console.log(err);
			next(err);
		}
	}

	static async getItemPesticidesInsecticide(req, res, next) {
		try {
			const data = await Item.findAll({
				where: { categoryid: 4 },
				attributes: ["name", "id"],
				order: [["createdAt", "DESC"]],
			});
			if (!data) {
				throw {
					name: "NotFound",
				};
			}
			res.status(200).json(data);
		} catch (err) {
			console.log(err);
			next(err);
		}
	}

	static async getItemPesticidesZpt(req, res, next) {
		try {
			const data = await Item.findAll({
				where: { categoryid: 5 },
				attributes: ["name", "id"],
				order: [["createdAt", "DESC"]],
			});
			if (!data) {
				throw {
					name: "NotFound",
				};
			}
			res.status(200).json(data);
		} catch (err) {
			console.log(err);
			next(err);
		}
	}

	static async getItemPesticidesPerekat(req, res, next) {
		try {
			const data = await Item.findAll({
				where: { categoryid: 6 },
				attributes: ["name", "id"],
				order: [["createdAt", "DESC"]],
			});
			if (!data) {
				throw {
					name: "NotFound",
				};
			}
			res.status(200).json(data);
		} catch (err) {
			console.log(err);
			next(err);
		}
	}

	static async getItemSeeds(req, res, next) {
		try {
			const data = await Item.findAll({
				where: { categoryid: 9 },
				attributes: ["name", "id", 'description'],
				order: [["createdAt", "ASC"]],
			});
			if (!data) {
				throw {
					name: "NotFound",
				};
			}
			res.status(200).json(data);
		} catch (err) {
			console.log(err);
			next(err);
		}
	}

	static async getItemFertilizers(req, res, next) {
		try {
			const data = await Item.findAll({
				where: { categoryid: 7 },
				attributes: ["name", "id"],
				order: [["createdAt", "DESC"]],
			});
			if (!data) {
				throw {
					name: "NotFound",
				};
			}
			res.status(200).json(data);
		} catch (err) {
			console.log(err);
			next(err);
		}
	}

	static async getItemMaterial(req, res, next) {
		try {
			const data = await Item.findAll({
				where: { categoryid: 8 },
				attributes: ["name", "id"],
				order: [["createdAt", "DESC"]],
			});
			if (!data) {
				throw {
					name: "NotFound",
				};
			}
			res.status(200).json(data);
		} catch (err) {
			console.log(err);
			next(err);
		}
	}

	static async getItemPlant(req, res, next) {
		try {
			const data = await Item.findAll({
				where: { categoryid: 1 },
				attributes: ["name", "id"],
				order: [["createdAt", "DESC"]],
			});
			if (!data) {
				throw {
					name: "NotFound",
				};
			}
			res.status(200).json(data);
		} catch (err) {
			console.log(err);
			next(err);
		}
	}

	static async getItem(req, res, next) {
		try {
			const { filter, search, page, filterStatus } = req.query;
			console.log(req.query, "<< ini req query");
			let limit = 8;
			let offset = 0;

			const opt = {
				include: [
					{
						model: Category,
						attributes: ["name"],
					},
					{
						model: Uom,
						attributes: ["name"],
					},
				],
				attributes: {
					exclude: ["createdAt", "updatedAt", 'categoryid', 'uomid', 'standardqty', 'status'],
				},
				order: [["createdAt", "DESC"]],
			};

			if (
				filter !== "" &&
				typeof filter !== "undefined" &&
				search &&
				filterStatus !== "" &&
				typeof filterStatus !== "undefined"
			) {
				{
					const query = filter.split(",").map((item) => ({
						[Op.eq]: item,
					}));
					const queryStatus = filterStatus.split(",").map((item) => ({
						[Op.eq]: item,
					}));

					opt.where = {
						categoryid: {
							[Op.or]: query,
						},
						arcStatus: {
							[Op.or]: queryStatus,
						},
						name: {
							[Op.iLike]: `%${search}%`,
						},
					};
				}
			} else if (
				filterStatus !== "" &&
				typeof filterStatus !== "undefined" &&
				search
			) {
				const query = filterStatus.split(",").map((item) => ({
					[Op.eq]: item,
				}));
				opt.where = {
					arcStatus: {
						[Op.or]: query,
					},
					name: {
						[Op.iLike]: `%${search}%`,
					},
				};
			} else if (filter !== "" && typeof filter !== "undefined" && search) {
				const query = filter.split(",").map((item) => ({
					[Op.eq]: item,
				}));
				opt.where = {
					categoryid: {
						[Op.or]: query,
					},
					name: {
						[Op.iLike]: `%${search}%`,
					},
				};
			} else if (
				filter !== "" &&
				typeof filter !== "undefined" &&
				filterStatus !== "" &&
				typeof filterStatus !== "undefined"
			) {
				const query = filter.split(",").map((item) => ({
					[Op.eq]: item,
				}));
				const queryStatus = filterStatus.split(",").map((item) => ({
					[Op.eq]: item,
				}));
				opt.where = {
					categoryid: {
						[Op.or]: query,
					},
					arcStatus: {
						[Op.or]: queryStatus,
					},
				};
			} else if (filter !== "" && typeof filter !== "undefined") {
				const query = filter.split(",").map((item) => ({
					[Op.eq]: item,
				}));
				opt.where = {
					categoryid: {
						[Op.or]: query,
					},
				};
			} else if (
				filterStatus !== "" &&
				typeof filterStatus !== "undefined"
			) {
				const query = filterStatus.split(",").map((item) => ({
					[Op.eq]: item,
				}));
				opt.where = {
					arcStatus: {
						[Op.or]: query,
					},
				};
			} else if (search) {
				opt.where = {
					name: {
						[Op.iLike]: `%${search}%`,
					},
				};
			}

			if (page !== "" && typeof page !== "undefined") {
				offset = page * limit - limit;
				opt.offset = offset;
			}
			opt.limit = limit;

			let data = await Item.findAndCountAll(opt);
			if (!data) {
				throw {
					name: "NotFound",
				};
			}
			res.status(200).json(data);
		} catch (err) {
			console.log(err);
			next(err);
		}
	}

	static async getItemById(req, res, next) {
		try {
			const { id } = req.params;
			const data = await Item.findByPk(id, {
				include: [
					{
						model: Category,
						attributes: ["name"],
					},
					{
						model: Uom,
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

	static async postItem(req, res, next) {
		try {
			let { name, description, categoryid, uomid, standardqty } = req.body;
			let status = "draft";
			let arcStatus = "avail";
			let code = "";
			if (categoryid === 1) {
				const min = 1121;
				const max = 9999;
				const randomNumber =
					Math.floor(Math.random() * (max - min + 1)) + min;
				code = `VEGETABLE00${randomNumber}`;
			}
			if (categoryid === 2) {
				const min = 1121;
				const max = 9999;
				const randomNumber =
					Math.floor(Math.random() * (max - min + 1)) + min;
				code = `FRUIT00${randomNumber}`;
			}
			if (categoryid === 3) {
				const min = 1121;
				const max = 9999;
				const randomNumber =
					Math.floor(Math.random() * (max - min + 1)) + min;
				code = `PESFUNGI00${randomNumber}`;
			}
			if (categoryid === 4) {
				const min = 1121;
				const max = 9999;
				const randomNumber =
					Math.floor(Math.random() * (max - min + 1)) + min;
				code = `PESINSEK00${randomNumber}`;
			}
			if (categoryid === 5) {
				const min = 1121;
				const max = 9999;
				const randomNumber =
					Math.floor(Math.random() * (max - min + 1)) + min;
				code = `PESZPT00${randomNumber}`;
			}
			if (categoryid === 7) {
				const min = 1121;
				const max = 9999;
				const randomNumber =
					Math.floor(Math.random() * (max - min + 1)) + min;
				code = `FERTELIZER00${randomNumber}`;
			}
			if (categoryid === 6) {
				const min = 1121;
				const max = 9999;
				const randomNumber =
					Math.floor(Math.random() * (max - min + 1)) + min;
				code = `PERPEREK00${randomNumber}`;
			}
			if (categoryid === 8) {
				const min = 1121;
				const max = 9999;
				const randomNumber =
					Math.floor(Math.random() * (max - min + 1)) + min;
				code = `MATERIAL00${randomNumber}`;
			}
			if (categoryid === 9) {
				const min = 1121;
				const max = 9999;
				const randomNumber =
					Math.floor(Math.random() * (max - min + 1)) + min;
				code = `SEED00${randomNumber}`;
			}
			if (categoryid === 12) {
				const min = 1000;
				const max = 9999;
				const randomNumber =
					Math.floor(Math.random() * (max - min + 1)) + min;
				code = `TOOL00${randomNumber}`;
			}
			let data = await Item.create({
				name,
				code,
				description,
				categoryid,
				uomid,
				standardqty,
				status,
				arcStatus,
			});

			res.status(201).json(`${data.name} has been added`);
		} catch (err) {
			console.log(err);
			next(err);
		}
	}

	static async putItem(req, res, next) {
		try {
			let { id } = req.params;
			let { name, code, description, status, categoryid, uomid, standardqty } =
				req.body;
			let findData = await Item.findByPk(id);
			if (!findData) {
				throw {
					name: "NotFound",
				};
			}
			await Item.update(
				{
					name,
					code,
					description,
					categoryid,
					uomid,
					standardqty,
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

	static async deleteItem(req, res, next) {
		try {
			const { id } = req.params;

			let findData = await Item.findByPk(id);
			if (!findData) {
				throw {
					name: "NotFound",
				};
			}

			await Item.destroy({
				where: { id },
			});

			res.status(200).json(`${findData.name} has been deleted`);
		} catch (err) {
			next(err);
		}
	}
}

module.exports = ItemController;
