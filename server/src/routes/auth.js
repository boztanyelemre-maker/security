const express = require('express');
const authController = require('../controllers/authController');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/register/buyer', authController.registerBuyer);
router.post('/register/provider', authController.registerProvider);
router.post('/login', authController.login);
router.get('/me', requireAuth, authController.me);
router.get('/admin-only', requireAuth, requireRole('ADMIN'), authController.adminOnly);

module.exports = router;
