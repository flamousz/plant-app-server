const express = require('express')
const TaskController = require('../controllers/task')
const upload = require('../middlewares/multer')
const taskRouter = express.Router()





taskRouter.put('/sheet', upload.single('pictureAccident'), TaskController.putTaskSheetVerification)
taskRouter.post('/', TaskController.postTask)
taskRouter.get('/', TaskController.getTask)
taskRouter.get('/sheet', TaskController.getTaskSheet)
taskRouter.post('/sheet', TaskController.postTaskSheet)
taskRouter.get('/:id', TaskController.getTaskById)
taskRouter.put('/:id', TaskController.putTask)
taskRouter.delete('/:id', TaskController.deleteTask)
taskRouter.patch('/:id', TaskController.patchArcStatusTask)

taskRouter.get('/sheet/:id', TaskController.getTaskSheetById)

module.exports = taskRouter