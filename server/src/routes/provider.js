const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const { rateLimit } = require('../middleware/rateLimit');
const { validateUuidParams } = require('../middleware/validateUuidParams');
const providerController = require('../controllers/providerController');

const router = express.Router();

// Provider routes: requireAuth + requireRole("PROVIDER_USER")
router.use(requireAuth);
router.use(requireRole('PROVIDER_USER'));

router.get('/matches', providerController.listMatches);
router.get('/offers', providerController.listOffers);
router.get('/requests/:id', validateUuidParams, providerController.getRequest);
router.post(
  '/requests/:id/offers',
  validateUuidParams,
  rateLimit({ id: 'provider-offer', windowMs: 60_000, max: 20 }),
  providerController.createOffer,
);
router.post('/requests/:id/payment-report', validateUuidParams, providerController.createPaymentReport);

module.exports = router;

