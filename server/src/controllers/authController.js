const authService = require('../services/authService');

async function registerBuyer(req, res, next) {
  try {
    const result = await authService.registerBuyer(req.body);
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
    res.status(200).json({
      data: result,
      meta: {},
    });
  } catch (e) {
    next(e);
  }
}

module.exports = { registerBuyer, registerProvider, login };
