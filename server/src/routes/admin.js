const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.use(requireAuth);
router.use(requireRole('ADMIN'));

router.get('/requests', adminController.listRequests);
router.get('/offers', adminController.listOffers);
router.get('/risk-flags', adminController.listRiskFlags);
router.get('/payment-reports', adminController.listPaymentReports);

module.exports = router;

