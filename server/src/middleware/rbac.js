/**
 * RBAC middleware.
 * Kullanım: requireRole('ADMIN'), requireRole('BUYER_USER', 'PROVIDER_USER')
 * Beklenti: req.user.roles = ['ADMIN', ...] gibi bir array (requireAuth sonrası).
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !Array.isArray(req.user.roles)) {
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

module.exports = { requireRole };

