const express = require("express");
const EmployeeController = require("../controllers/employeeController");
const employeeRouter = express.Router();

employeeRouter.post('/task',EmployeeController.getEmployeeAtTaskSheet)
employeeRouter.put('/task', EmployeeController.putEmployeeAtTaskSheet)
employeeRouter.get('/',EmployeeController.getEmployee)
employeeRouter.post('/',EmployeeController.postEmployee)
employeeRouter.delete('/:id',EmployeeController.deleteEmployee)
employeeRouter.get('/:id', EmployeeController.getEmployeeById)
employeeRouter.put('/:id', EmployeeController.putEmployee)
employeeRouter.patch('/:id', EmployeeController.patchArcStatusEmployee)



module.exports = employeeRouter;
