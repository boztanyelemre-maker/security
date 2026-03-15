const authService = require('../services/authService');
const { auditLog } = require('../middleware/auditLog');

async function registerBuyer(req, res, next) {
  try {
    const result = await authService.registerBuyer(req.body);
    auditLog(req, 'register', { type: 'buyer', userId: result?.user?.id, orgId: result?.organization?.id });
    res.status(201).json({
      data: result,
      meta: {},
    });
  } catch (e) {
    next(e);
  }
}

async function registerProvider(req, res, next) {
  try {
    const result = await authService.registerProvider(req.body);
    auditLog(req, 'register', { type: 'provider', userId: result?.user?.id, orgId: result?.organization?.id });
    res.status(201).json({
      data: result,
      meta: {},
    });
  } catch (e) {
    next(e);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    auditLog(req, 'login', { userId: result?.user?.user_id, orgId: result?.user?.org_id });
    res.status(200).json({
      data: result,
      meta: {},
    });
  } catch (e) {
    next(e);
  }
}

async function me(req, res, next) {
  try {
    const result = await authService.getMe(req.user.user_id);
    res.status(200).json({
      data: result,
      meta: {},
    });
  } catch (e) {
    next(e);
  }
}

async function adminOnly(req, res, next) {
  try {
    res.status(200).json({
      data: { message: 'Admin only area' },
      meta: {},
    });
  } catch (e) {
    next(e);
  }
}

module.exports = { registerBuyer, registerProvider, login, me, adminOnly };
