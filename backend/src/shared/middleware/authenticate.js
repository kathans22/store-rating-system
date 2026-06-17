const { verifyToken } = require('../utils/jwt');
const AppError = require('../errors/AppError');

function authenticate(req, _res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authentication required', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401));
  }
}

module.exports = authenticate;
