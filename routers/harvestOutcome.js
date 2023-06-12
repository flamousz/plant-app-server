const express = require('express')
const HarvestOutcomeController = require('../controllers/harvestoutcomeController')
const harvestOutcomeRouter = express.Router()

harvestOutcomeRouter.get('/', HarvestOutcomeController.getHarvestOutcome)
harvestOutcomeRouter.post('/', HarvestOutcomeController.postHarvestOutcome)
harvestOutcomeRouter.get('/:id', HarvestOutcomeController.getHarvestOutcomeBySheet)

module.exports = harvestOutcomeRouter