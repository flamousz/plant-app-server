const express = require('express')
const PlantSheetController = require('../controllers/plantSheet')
const plantSheetRouter=express.Router()

plantSheetRouter.get('/', PlantSheetController.getPlantSheet)
plantSheetRouter.post('/', PlantSheetController.postPlantSheet)
plantSheetRouter.get('/:id', PlantSheetController.getPlantSheetById)
plantSheetRouter.put('/:id', PlantSheetController.putPlantSheet)
plantSheetRouter.patch('/:id', PlantSheetController.patchArcStatusPlantSheet)
plantSheetRouter.delete('/:id', PlantSheetController.deletePlantSheet)


module.exports=plantSheetRouter