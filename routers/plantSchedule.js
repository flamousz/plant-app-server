const express = require('express')
const PlantScheduleController = require('../controllers/plantSchedule')
const plantScheduleRouter = express.Router()

plantScheduleRouter.get('/', PlantScheduleController.getSchedule)
plantScheduleRouter.get('/task', PlantScheduleController.getScheduleTask)
plantScheduleRouter.post('/', PlantScheduleController.postSchedule)
plantScheduleRouter.put('/', PlantScheduleController.putSchedule)
plantScheduleRouter.put('/code', PlantScheduleController.putCodeSchedule)
plantScheduleRouter.get('/:id', PlantScheduleController.getScheduleById)
plantScheduleRouter.patch('/', PlantScheduleController.patchStatusPlantSchedule)

module.exports = plantScheduleRouter