const express=require('express')
const seedNurseriesController = require('../controllers/SeedNurseries')
const seedNurseriesRouter=express.Router()

seedNurseriesRouter.patch('/', seedNurseriesController.patchSeedId)
seedNurseriesRouter.get('/', seedNurseriesController.getSeedNurseries)
seedNurseriesRouter.get('/:id', seedNurseriesController.getSeedNurseriesById)

module.exports = seedNurseriesRouter