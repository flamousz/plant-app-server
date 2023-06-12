const { Op } = require("sequelize");
const {
	PlantSheet,
	Item,
	PlantType,
	materialConjunction,
	PesticideConjunction,
	fertilizerConjunction,
	SeedConjunction,
	Category,
	Uom,
	PlantsheetTaskConjunction,
	Task,
} = require("../models/index");

class PlantSheetController {
	static async getPlantSheet(req, res, next) {
		try {
			const { filter } = req.query;
			const opt = {
				include: [
					{ model: Item, as: "plant", attributes: ["name"] },
					{
						model: PlantsheetTaskConjunction,
						include: [
							{
								model: Task,
								attributes: ["name", "TaskPerMinute", "description"],
							},
							{
								model: Item,
								attributes: ["name", "arcStatus"],
							},
						],
						attributes: ["id", "PlantSheetId", "day", "description"],
						order: [["id", "DESC"]],
					},
					{
						model: PlantType,
						attributes: ["name"],
					},
					{
						model: fertilizerConjunction,
						attributes: ["id", "type"],
						include: {
							model: Item,
							attributes: ["name", "standardqty", "description"],
							include: [
								{
									model: Uom,
									attributes: ["name"],
								},
							],
						},
						order: [["id", "DESC"]],
					},
					{
						model: PesticideConjunction,
						attributes: ["id", "type"],
						include: {
							model: Item,
							attributes: ["name", "standardqty", "description"],
							include: [
								{
									model: Uom,
									attributes: ["name"],
								},
							],
						},
						order: [["id", "DESC"]],
					},
					{
						model: materialConjunction,
						attributes: ["id", "type"],
						include: {
							model: Item,
							attributes: ["name", "standardqty", "description"],
							include: [
								{
									model: Uom,
									attributes: ["name"],
								},
							],
						},
						order: [["id", "DESC"]],
					},
				],
				attributes: {
					exclude: ["createdAt", "updatedAt", "planttypeid", "plantid"],
				},
				order: [["createdAt", "DESC"]],
				where: {
					arcStatus: "avail",
				},
			};

			if (filter !== "" && typeof filter !== "undefined") {
				const query = filter.split(",").map((item) => ({
					[Op.eq]: item,
				}));
				opt.where = {
					arcStatus: {
						[Op.or]: query,
					},
				};
			}

			const data = await PlantSheet.findAll(opt);
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

	static async getPlantSheetById(req, res, next) {
		try {
			const { id } = req.params;
			const data = await PlantSheet.findByPk(id, {
				include: [
					{ model: Item, as: "plant", attributes: ["name", "code"] },
					{
						model: SeedConjunction,
						attributes: ["id", "seedid", "plantsheetid"],
						include: {
							model: Item,
							attributes: ["name", "description", "standardqty"],
						},
					},
					{
						model: fertilizerConjunction,
						attributes: [
							"id",
							"dose",
							"fertilizerid",
							"plantsheetid",
							"type",
						],
						include: {
							model: Item,
							attributes: ["name", "standardqty", "description"],
							include: [
								{
									model: Uom,
									attributes: ["name"],
								},
							],
						},
						order: [["id", "DESC"]],
					},
					{
						model: PesticideConjunction,
						attributes: [
							"id",
							"dose",
							"pesticideid",
							"plantsheetid",
							"type",
						],
						include: {
							model: Item,
							attributes: ["name", "standardqty", "description"],
							include: [
								{
									model: Uom,
									attributes: ["name"],
								},
								{
									model: Category,
									attributes: ["name"],
								},
							],
						},
					},
					{
						model: materialConjunction,
						attributes: [
							"id",
							"dose",
							"materialid",
							"plantsheetid",
							"type",
						],
						include: {
							model: Item,
							attributes: ["name", "standardqty", "description"],
							include: [
								{
									model: Uom,
									attributes: ["name"],
								},
							],
						},
					},
					{
						model: PlantsheetTaskConjunction,
						include: [
							{
								model: Task,
								attributes: ["name", "TaskPerMinute", "description"],
							},
							{
								model: Item,
								attributes: ["name", "arcStatus"],
							},
						],
						attributes: ["id", "PlantSheetId", "day", "description"],
						order: [["id", "DESC"]],
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
			console.log(err);
			next(err);
		}
	}

	static async postPlantSheet(req, res, next) {
		try {
			console.log(req.body, "<< ini req.body");
			let {
				plantsheetTaskProcessingConjunctions,
				plantsheetTaskPlantingConjunctions,
				plantsheetTaskConjunctions,
				plantid,
				seedlingAge,
				harvestAge,
				harvestTime,
				cropAge,
				cropProdWeight,
				planttypeid,
				materialConjunctions,
				materialConjunctionsNursery,
				PesticideConjunctions,
				PesticideConjunctionsNursery,
				fertilizerConjunctions,
				fertilizerConjunctionsNursery,
				fallacyNursery,
				plantPerMetre,
			} = req.body;

			let status = "draft";
			let arcStatus = "avail";

			const plantsheet = await PlantSheet.create({
				plantid,
				seedlingAge,
				harvestAge,
				harvestTime,
				cropAge,
				cropProdWeight,
				planttypeid,
				status,
				arcStatus,
				fallacyNursery,
				plantPerMetre,
			});

			plantsheetTaskConjunctions.forEach(
				(el) => (el.PlantSheetId = plantsheet.id)
			);
			plantsheetTaskPlantingConjunctions.forEach(
				(el) => (el.PlantSheetId = plantsheet.id)
			);
			plantsheetTaskProcessingConjunctions.forEach(
				(el) => (el.PlantSheetId = plantsheet.id)
			);
			PesticideConjunctions.forEach((el) => {
				el.type = "planting";
				el.plantsheetid = plantsheet.id;
			});
			PesticideConjunctionsNursery.forEach((el) => {
				el.type = "nursery";
				el.plantsheetid = plantsheet.id;
			});

			materialConjunctions.forEach((el) => {
				el.type = "planting";
				el.plantsheetid = plantsheet.id;
			});

			materialConjunctionsNursery.forEach((el) => {
				el.type = "nursery";
				el.plantsheetid = plantsheet.id;
			});

			fertilizerConjunctions.forEach((el) => {
				el.type = "planting";
				el.plantsheetid = plantsheet.id;
			});
			fertilizerConjunctionsNursery.forEach((el) => {
				el.type = "nursery";
				el.plantsheetid = plantsheet.id;
			});

			// SeedConjunctions.forEach((el) => {
			// 	el.plantsheetid = plantsheet.id;
			// });
			console.log(
				plantsheetTaskConjunctions,
				"<<<< plantsheetTaskConjunctions"
			);
			console.log(materialConjunctions, "<<< materialConjunctions");
			console.log(
				materialConjunctionsNursery,
				"<<< materialConjunctionsNursery"
			);
			console.log(materialConjunctions, "<<< materialConjunctions");
			console.log(
				fertilizerConjunctionsNursery,
				"<<< fertilizerConjunctionsNursery"
			);

			if (plantsheetTaskConjunctions[0].TaskId !== 0) {
				await PlantsheetTaskConjunction.bulkCreate(
					plantsheetTaskConjunctions
				);
			}
			if (plantsheetTaskPlantingConjunctions[0].TaskId !== 0) {
				await PlantsheetTaskConjunction.bulkCreate(
					plantsheetTaskPlantingConjunctions
				);
			}
			if (plantsheetTaskProcessingConjunctions[0].TaskId !== 0) {
				await PlantsheetTaskConjunction.bulkCreate(
					plantsheetTaskProcessingConjunctions
				);
			}

			if (materialConjunctions[0].materialid !== 0) {
				await materialConjunction.bulkCreate(materialConjunctions);
			}
			if (materialConjunctionsNursery[0].materialid !== 0) {
				await materialConjunction.bulkCreate(materialConjunctionsNursery);
			}
			if (PesticideConjunctions[0].pesticideid !== 0) {
				await PesticideConjunction.bulkCreate(PesticideConjunctions);
			}
			if (PesticideConjunctionsNursery[0].pesticideid !== 0) {
				await PesticideConjunction.bulkCreate(PesticideConjunctionsNursery);
			}
			if (fertilizerConjunctions[0].fertilizerid !== 0) {
				await fertilizerConjunction.bulkCreate(fertilizerConjunctions);
			}
			if (fertilizerConjunctionsNursery[0].fertilizerid !== 0) {
				await fertilizerConjunction.bulkCreate(
					fertilizerConjunctionsNursery
				);
			}
			// if (SeedConjunctions[0].seedid !== 0) {
			// 	await SeedConjunction.bulkCreate(SeedConjunctions);
			// }

			res.status(200).json("new plantsheet has been added");
		} catch (err) {
			console.log(err);
			next(err);
		}
	}

	static async deletePlantSheet(req, res, next) {
		try {
			const { id } = req.params;
			const data = await PlantSheet.findByPk(id, {
				include: [{ model: Item, as: "plant", attributes: ["name"] }],
			});
			if (!data) {
				throw {
					name: "NotFound",
				};
			}

			await PlantSheet.destroy({
				where: { id },
			});

			res.status(200).json(`${data.plant.name} has been deleted`);
		} catch (err) {
			console.log(err);
			next(err);
		}
	}

	static async patchArcStatusPlantSheet(req, res, next) {
		try {
			console.log(req.body, "<<< ini req.body");
			const { id } = req.params;
			const { arcStatus } = req.body;
			const data = await PlantSheet.findByPk(id);
			if (!data) {
				throw {
					name: "NotFound",
				};
			}

			await PlantSheet.update(
				{ arcStatus },
				{
					where: { id },
				}
			);

			res.status(200).json("Plant status successfully changed ");
		} catch (err) {
			console.log(err);
			next(err);
		}
	}

	static async putPlantSheet(req, res, next) {
		try {
			const { id } = req.params;
			console.log(req.body, "<< ini req.body dapet dari client");
			let {
				plantid,
				seedlingAge,
				harvestAge,
				harvestTime,
				cropAge,
				cropProdWeight,
				planttypeid,
				PesticideConjunctions,
				fertilizerConjunctions,
				materialConjunctions,
				status,
			} = req.body;

			const initialPlantsheet = await PlantSheet.findByPk(id, {
				include: [
					{ model: Item, as: "plant", attributes: ["name", "code"] },
					{
						model: SeedConjunction,
						attributes: ["id", "seedid", "plantsheetid"],
					},
					{
						model: fertilizerConjunction,
						attributes: ["id", "dose", "fertilizerid", "plantsheetid"],
					},
					{
						model: PesticideConjunction,
						attributes: ["id", "dose", "pesticideid", "plantsheetid"],
					},
					{
						model: materialConjunction,
						attributes: ["id", "dose", "materialid", "plantsheetid"],
					},
				],
				attributes: {
					exclude: ["createdAt", "updatedAt"],
				},
				order: [["createdAt", "DESC"]],
			});

			const initialIDofPesticide =
				initialPlantsheet.PesticideConjunctions.map((el) => el.id);
			const initialIDofMaterial = initialPlantsheet.materialConjunctions.map(
				(el) => el.id
			);
			const initialIDofFertilizer =
				initialPlantsheet.fertilizerConjunctions.map((el) => el.id);

			const pesticidesNotDeletedPlan = PesticideConjunctions.map(
				(el) => el.id // hanya menampilkan id
			);
			const materialsNotDeletedPlan = materialConjunctions.map(
				(el) => el.id
			);
			const fertilizersNotDeletedPlan = fertilizerConjunctions.map(
				(el) => el.id
			);

			const pesticidesDeletedPlan = initialIDofPesticide.filter(
				(el) => !pesticidesNotDeletedPlan.includes(el)
			);
			const materialsDeletedPlan = initialIDofMaterial.filter(
				(el) => !materialsNotDeletedPlan.includes(el)
			);
			const fertilizersDeletedPlan = initialIDofFertilizer.filter(
				(el) => !fertilizersNotDeletedPlan.includes(el)
			);

			// searching element that not have 'id' key
			const newPesticideWithoutId = PesticideConjunctions.filter(
				(el) => !el.hasOwnProperty("id")
			);
			const newMaterialsWithoutId = materialConjunctions.filter(
				(el) => !el.hasOwnProperty("id")
			);
			const newFertilizersWithoutId = fertilizerConjunctions.filter(
				(el) => !el.hasOwnProperty("id")
			);

			// searching element that  have 'id' key
			const newPesticideWithId = PesticideConjunctions.filter((el) =>
				el.hasOwnProperty("id")
			);
			const newMaterialsWithId = materialConjunctions.filter((el) =>
				el.hasOwnProperty("id")
			);
			const newFertilizersWithId = fertilizerConjunctions.filter((el) =>
				el.hasOwnProperty("id")
			);

			await PlantSheet.update(
				{
					plantid,
					seedlingAge,
					harvestAge,
					harvestTime,
					cropAge,
					cropProdWeight,
					planttypeid,
					status,
				},
				{
					where: { id },
					returning: true,
				}
			);

			if (pesticidesDeletedPlan[0]) {
				for (const el of pesticidesDeletedPlan) {
					await PesticideConjunction.destroy({
						where: {
							id: el,
						},
					});
				}
			}
			if (materialsDeletedPlan[0]) {
				for (const el of materialsDeletedPlan) {
					await materialConjunction.destroy({
						where: {
							id: el,
						},
					});
				}
			}
			if (fertilizersDeletedPlan[0]) {
				for (const el of fertilizersDeletedPlan) {
					await fertilizerConjunction.destroy({
						where: {
							id: el,
						},
					});
				}
			}

			if (newPesticideWithId[0]) {
				for (const el of newPesticideWithId) {
					await PesticideConjunction.update(
						{
							dose: el.dose,
							pesticideid: el.pesticideid,
						},
						{
							where: {
								id: el.id,
							},
						}
					);
				}
			}
			if (newMaterialsWithId[0]) {
				for (const el of newMaterialsWithId) {
					await materialConjunction.update(
						{
							dose: el.dose,
							materialid: el.materialid,
						},
						{
							where: {
								id: el.id,
							},
						}
					);
				}
			}
			if (newFertilizersWithId[0]) {
				for (const el of newFertilizersWithId) {
					await fertilizerConjunction.update(
						{
							dose: el.dose,
							fertilizerid: el.fertilizerid,
						},
						{
							where: {
								id: el.id,
							},
						}
					);
				}
			}

			if (newPesticideWithoutId[0]) {
				newPesticideWithoutId.forEach((el) => (el.plantsheetid = id));
				await PesticideConjunction.bulkCreate(newPesticideWithoutId);
			}
			if (newMaterialsWithoutId[0]) {
				newMaterialsWithoutId.forEach((el) => (el.plantsheetid = id));
				await materialConjunction.bulkCreate(newMaterialsWithoutId);
			}
			if (newFertilizersWithoutId[0]) {
				newFertilizersWithoutId.forEach((el) => (el.plantsheetid = id));
				await fertilizerConjunction.bulkCreate(newFertilizersWithoutId);
			}

			res.status(200).json(`plantsheet successfully updated`);
		} catch (err) {
			console.log(err);
			next(err);
		}
	}
}

module.exports = PlantSheetController;
