const express=require('express')
const UomController = require('../controllers/uomController')
const uomRouter=express.Router()

uomRouter.get('/', UomController.getUom)
uomRouter.post("/", UomController.postUom);
uomRouter.get("/:id", UomController.getUomById);
uomRouter.put("/:id", UomController.putUom);
uomRouter.delete("/:id", UomController.deleteUom); 
uomRouter.patch("/:id", UomController.patchArcStatusEmployee); 

module.exports=uomRouter