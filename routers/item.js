const express = require('express')
const ItemController = require('../controllers/item')
const itemRouter=express.Router()

itemRouter.get('/', ItemController.getItem)
itemRouter.get('/plants', ItemController.getItemPlant)
itemRouter.get('/materials', ItemController.getItemMaterial)
itemRouter.get('/fertilizers', ItemController.getItemFertilizers)
itemRouter.get('/seeds', ItemController.getItemSeeds)
itemRouter.get('/pesticides', ItemController.getItemAllPesticide)
itemRouter.get('/pesticides/fungi', ItemController.getItemPesticidesFungi)
itemRouter.get('/pesticides/insecticide', ItemController.getItemPesticidesInsecticide)
itemRouter.get('/pesticides/zpt', ItemController.getItemPesticidesZpt)
itemRouter.get('/pesticides/perekat', ItemController.getItemPesticidesPerekat)
itemRouter.get('/plant', ItemController.getItemPlant)
itemRouter.get('/plant', ItemController.getItemPlant)
itemRouter.get('/tools', ItemController.getToolItem)
itemRouter.post('/', ItemController.postItem)
itemRouter.get('/:id', ItemController.getItemById)
itemRouter.put('/:id', ItemController.putItem)
itemRouter.delete('/:id', ItemController.deleteItem)
itemRouter.patch('/:id', ItemController.patchArcStatusItem)



module.exports=itemRouter