const express = require('express')
const NotificationController = require('../controllers/notification')
const notificationRouter = express.Router()

notificationRouter.get('/', NotificationController.getNotification)
notificationRouter.patch('/', NotificationController.patchIsReadNotification)

module.exports = notificationRouter