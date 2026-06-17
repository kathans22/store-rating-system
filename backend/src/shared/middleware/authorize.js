const AppError = require('../errors/AppError');

function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('Access denied', 403));
    }
    next();
  };
}

module.exports = authorize;
