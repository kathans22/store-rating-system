const express = require('express');
const storeController = require('./store.controller');
const authenticate = require('../../shared/middleware/authenticate');
const authorize = require('../../shared/middleware/authorize');
const asyncHandler = require('../../shared/middleware/asyncHandler');
const { ROLES } = require('../../shared/constants/roles');
const { listQueryRules, ratingRules } = require('./store.validator');

const router = express.Router();

router.use(authenticate, authorize(ROLES.USER));

router.get('/', listQueryRules, asyncHandler(storeController.browseStores));
router.post('/:storeId/ratings', ratingRules, asyncHandler(storeController.submitRating));

module.exports = router;
