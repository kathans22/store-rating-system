const express = require('express');
const ownerController = require('./owner.controller');
const authenticate = require('../../shared/middleware/authenticate');
const authorize = require('../../shared/middleware/authorize');
const asyncHandler = require('../../shared/middleware/asyncHandler');
const { ROLES } = require('../../shared/constants/roles');
const { dashboardQueryRules } = require('./owner.validator');

const router = express.Router();

router.use(authenticate, authorize(ROLES.STORE_OWNER));

router.get('/dashboard', dashboardQueryRules, asyncHandler(ownerController.getDashboard));

module.exports = router;
