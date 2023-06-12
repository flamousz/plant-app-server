const express = require("express");
const CategoryController = require("../controllers/category");
const categoryRouter = express.Router();

categoryRouter.get("/", CategoryController.getCategory);
categoryRouter.post("/", CategoryController.postCategory);
categoryRouter.get("/:id", CategoryController.getCategoryById);
categoryRouter.put("/:id", CategoryController.putCategory);
categoryRouter.delete("/:id", CategoryController.deleteCategory);
categoryRouter.patch("/:id", CategoryController.patchArcStatusCategory);

module.exports = categoryRouter;
