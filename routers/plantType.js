const express=require('express')
const PlantTypeController = require('../controllers/plantType')
const plantTypeRouter=express.Router()

plantTypeRouter.get('/', PlantTypeController.getPlantType)
plantTypeRouter.post("/", PlantTypeController.postPlantType);
plantTypeRouter.get("/:id", PlantTypeController.getPlantTypeById);
plantTypeRouter.put("/:id", PlantTypeController.putPlantType);
plantTypeRouter.delete("/:id", PlantTypeController.deletePlantType);


module.exports=plantTypeRouter