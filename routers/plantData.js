const express = require("express");
const PlantDataController = require("../controllers/plantData");
const plantDataRouter = express.Router();

plantDataRouter.get("/", PlantDataController.getPlantData);
plantDataRouter.post("/", PlantDataController.postPlantData);
plantDataRouter.get("/:id", PlantDataController.getPlantDataById);
plantDataRouter.put("/:id", PlantDataController.putPlantData);
plantDataRouter.delete("/:id", PlantDataController.deletePlantData);

module.exports = plantDataRouter;
