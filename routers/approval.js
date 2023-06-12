const express = require('express')
const ApprovalController = require('../controllers/approval')
const approvalRouter = express.Router()

approvalRouter.post('/', ApprovalController.getAllApproval)
approvalRouter.get('/master', ApprovalController.getAllApprovalMaster)
approvalRouter.put('/master', ApprovalController.putApprovalMaster)
approvalRouter.get('/', ApprovalController.getAllRejectedApproval)

module.exports = approvalRouter