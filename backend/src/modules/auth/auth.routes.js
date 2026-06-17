const express = require('express');
const authController = require('./auth.controller');
const authenticate = require('../../shared/middleware/authenticate');
const asyncHandler = require('../../shared/middleware/asyncHandler');
const { loginRules, registerRules, updatePasswordRules } = require('./auth.validator');

const router = express.Router();

router.post('/register', registerRules, asyncHandler(authController.register));
router.post('/login', loginRules, asyncHandler(authController.login));
router.get('/profile', authenticate, asyncHandler(authController.getProfile));
router.put('/password', authenticate, updatePasswordRules, asyncHandler(authController.updatePassword));

module.exports = router;
