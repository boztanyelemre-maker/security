const express = require('express');
const authController = require('../controllers/authController');
const { requireAuth, requireRole } = require('../middleware/auth');
const { rateLimit } = require('../middleware/rateLimit');

const router = express.Router();

router.post(
  '/register/buyer',
  rateLimit({ id: 'auth-register', windowMs: 60_000, max: 5 }),
  authController.registerBuyer,
);
router.post(
  '/register/provider',
  rateLimit({ id: 'auth-register', windowMs: 60_000, max: 5 }),
  authController.registerProvider,
);
router.post(
  '/login',
  rateLimit({ id: 'auth-login', windowMs: 60_000, max: 10 }),
  authController.login,
);
router.get('/me', requireAuth, authController.me);
router.get('/admin-only', requireAuth, requireRole('ADMIN'), authController.adminOnly);

module.exports = router;
