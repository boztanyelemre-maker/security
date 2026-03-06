const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const providerController = require('../controllers/providerController');

const router = express.Router();

// Provider routes: requireAuth + requireRole("PROVIDER_USER")
router.use(requireAuth);
router.use(requireRole('PROVIDER_USER'));

router.get('/matches', providerController.listMatches);
router.get('/offers', providerController.listOffers);
router.get('/requests/:id', providerController.getRequest);
router.post('/requests/:id/offers', providerController.createOffer);

module.exports = router;

