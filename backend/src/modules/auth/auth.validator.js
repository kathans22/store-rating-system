const { body } = require('express-validator');
const { PASSWORD_REGEX } = require('../../shared/constants/validation');
const validateRequest = require('../../shared/middleware/validateRequest');

const nameValidation = body('name')
  .trim()
  .isLength({ min: 20, max: 60 })
  .withMessage('Name must be between 20 and 60 characters');

const addressValidation = body('address')
  .trim()
  .isLength({ max: 400 })
  .withMessage('Address must not exceed 400 characters')
  .notEmpty()
  .withMessage('Address is required');

const emailValidation = body('email')
  .trim()
  .isEmail()
  .withMessage('Must be a valid email address')
  .normalizeEmail();

const passwordValidation = body('password')
  .matches(PASSWORD_REGEX)
  .withMessage(
    'Password must be 8-16 characters with at least one uppercase letter and one special character'
  );

const loginRules = [
  body('email').trim().isEmail().withMessage('Must be a valid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validateRequest,
];

const registerRules = [
  nameValidation,
  emailValidation,
  addressValidation,
  passwordValidation,
  validateRequest,
];

const updatePasswordRules = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .matches(PASSWORD_REGEX)
    .withMessage(
      'New password must be 8-16 characters with at least one uppercase letter and one special character'
    ),
  validateRequest,
];

module.exports = {
  loginRules,
  registerRules,
  updatePasswordRules,
};
