const jwtConfig = require('../config/jwt');
const { requireRole } = require('./rbac');

/**
 * Bearer JWT doğrular; req.user = { user_id, org_id, org_type, roles } set eder.
 * Token yok → 401 UNAUTHORIZED
 * Token bozuk/expired → 401 INVALID_TOKEN
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
    const payload = jwtConfig.verify(token);
    req.user = {
      user_id: payload.id,
      org_id: payload.organizationId || null,
      org_type: payload.organizationType || null,
      roles: payload.roles || [],
    };
    next();
  } catch (e) {
    return res.status(401).json({
      code: 'INVALID_TOKEN',
      message: 'Invalid or expired token',
      details: {},
      requestId: req.id,
    });
  }
}

module.exports = { requireAuth, requireRole };
