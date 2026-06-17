const { body, query, param } = require('express-validator');
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

const createUserRules = [
  nameValidation,
  emailValidation,
  addressValidation,
  passwordValidation,
  body('role')
    .isIn(['ADMIN', 'USER', 'STORE_OWNER'])
    .withMessage('Role must be ADMIN, USER, or STORE_OWNER'),
  validateRequest,
];

const createStoreRules = [
  body('name').trim().notEmpty().withMessage('Store name is required'),
  emailValidation,
  addressValidation,
  body('ownerId').optional({ nullable: true }).isInt({ min: 1 }).withMessage('Invalid owner ID'),
  validateRequest,
];

const listQueryRules = [
  query('name').optional().trim(),
  query('email').optional().trim(),
  query('address').optional().trim(),
  query('role').optional({ checkFalsy: true }).isIn(['ADMIN', 'USER', 'STORE_OWNER']),
  query('sortBy').optional().trim(),
  query('sortOrder').optional({ checkFalsy: true }).isIn(['asc', 'desc']),
  validateRequest,
];

const idParamRules = [
  param('id').isInt({ min: 1 }).withMessage('Invalid ID'),
  validateRequest,
];

module.exports = {
  createUserRules,
  createStoreRules,
  listQueryRules,
  idParamRules,
};
