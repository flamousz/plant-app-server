const express = require('express')
const UserController = require('../controllers/userController')
const userRouter = express.Router()

userRouter.get('/', UserController.getUsers)
userRouter.post('/login', UserController.login)
userRouter.post('/register', UserController.register)


module.exports=userRouter