const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Bearer JWT doğrular; req.user = { id, roles, organizationId, organizationType } set eder.
 * Token yok/geçersiz → 401.
 */
function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({
      code: 'UNAUTHORIZED',
      message: 'Missing or invalid token',
      details: {},
      requestId: req.id,
    });
  }
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({
      code: 'UNAUTHORIZED',
      message: 'Invalid or expired token',
      details: {},
      requestId: req.id,
    });
  }
}

/**
 * Sadece verilen rollerden biri varsa geçer.
 * requireAuth sonrası kullan: requireAuth, requireRole('BUYER_USER', 'PROVIDER_USER')
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res.status(403).json({
        code: 'FORBIDDEN',
        message: 'Forbidden',
        details: {},
        requestId: req.id,
      });
    }
    const hasRole = req.user.roles.some((r) => allowedRoles.includes(r));
    if (!hasRole) {
      return res.status(403).json({
        code: 'FORBIDDEN',
        message: 'Insufficient role',
        details: { allowed: allowedRoles },
        requestId: req.id,
      });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
