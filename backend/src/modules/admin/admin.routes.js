const express = require('express');
const adminController = require('./admin.controller');
const authenticate = require('../../shared/middleware/authenticate');
const authorize = require('../../shared/middleware/authorize');
const asyncHandler = require('../../shared/middleware/asyncHandler');
const { ROLES } = require('../../shared/constants/roles');
const {
  createUserRules,
  createStoreRules,
  listQueryRules,
  idParamRules,
} = require('./admin.validator');

const router = express.Router();

router.use(authenticate, authorize(ROLES.ADMIN));

router.get('/dashboard', asyncHandler(adminController.getDashboardStats));
router.post('/users', createUserRules, asyncHandler(adminController.createUser));
router.get('/users', listQueryRules, asyncHandler(adminController.getUsers));
router.get('/users/all', listQueryRules, asyncHandler(adminController.getAllUsers));
router.get('/users/:id', idParamRules, asyncHandler(adminController.getUserById));
router.post('/stores', createStoreRules, asyncHandler(adminController.createStore));
router.get('/stores', listQueryRules, asyncHandler(adminController.getStores));
router.get('/store-owners', asyncHandler(adminController.getStoreOwners));

module.exports = router;
