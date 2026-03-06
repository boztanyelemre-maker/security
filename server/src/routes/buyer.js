const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const buyerController = require('../controllers/buyerController');

const router = express.Router();

// Buyer routes: requireAuth + requireRole("BUYER_USER")
router.use(requireAuth);
router.use(requireRole('BUYER_USER'));

router.get('/dashboard', (req, res) => {
  res.status(200).json({
    data: { message: 'Buyer area', user_id: req.user.user_id, org_id: req.user.org_id },
    meta: {},
  });
});

router.get('/requests', buyerController.listRequests);
router.get('/requests/:id/offers', buyerController.listOffersForRequest);
router.get('/requests/:id', buyerController.getRequest);
router.post('/requests', buyerController.createRequest);
router.put('/requests/:id', buyerController.updateRequest);
router.post('/requests/:id/publish', buyerController.publishRequest);

module.exports = router;
