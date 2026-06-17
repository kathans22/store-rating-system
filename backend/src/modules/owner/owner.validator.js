const { query } = require('express-validator');
const validateRequest = require('../../shared/middleware/validateRequest');

const dashboardQueryRules = [
  query('sortBy').optional().trim(),
  query('sortOrder').optional({ checkFalsy: true }).isIn(['asc', 'desc']),
  validateRequest,
];

module.exports = { dashboardQueryRules };
