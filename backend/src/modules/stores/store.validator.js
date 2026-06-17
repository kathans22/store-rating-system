const { body, query, param } = require('express-validator');
const validateRequest = require('../../shared/middleware/validateRequest');

const listQueryRules = [
  query('name').optional().trim(),
  query('address').optional().trim(),
  query('sortBy').optional().trim(),
  query('sortOrder').optional({ checkFalsy: true }).isIn(['asc', 'desc']),
  validateRequest,
];

const ratingRules = [
  param('storeId').isInt({ min: 1 }).withMessage('Invalid store ID'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  validateRequest,
];

module.exports = { listQueryRules, ratingRules };
