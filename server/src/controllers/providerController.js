const providerService = require('../services/providerService');
const offerService = require('../services/offerService');

async function listMatches(req, res, next) {
  try {
    const providerOrgId = req.user.org_id;
    if (!providerOrgId) {
      return res.status(403).json({
        code: 'FORBIDDEN',
        message: 'Provider organization required',
        details: {},
        requestId: req.id,
      });
    }

    const limit = req.query.limit;
    const offset = req.query.offset;

    const result = await providerService.listMatchesForProvider(providerOrgId, { limit, offset });
    res.status(200).json({
      data: result.items,
      meta: { total: result.total, limit: result.limit, offset: result.offset },
    });
  } catch (e) {
    next(e);
  }
}

async function getRequest(req, res, next) {
  try {
    const providerOrgId = req.user.org_id;
    if (!providerOrgId) {
      return res.status(403).json({
        code: 'FORBIDDEN',
        message: 'Provider organization required',
        details: {},
        requestId: req.id,
      });
    }

    const requestId = req.params.id;
    const item = await providerService.getRequestForProvider(providerOrgId, requestId);
    res.status(200).json({
      data: item,
      meta: {},
    });
  } catch (e) {
    next(e);
  }
}

async function createOffer(req, res, next) {
  try {
    const providerOrgId = req.user.org_id;
    if (!providerOrgId) {
      return res.status(403).json({
        code: 'FORBIDDEN',
        message: 'Provider organization required',
        details: {},
        requestId: req.id,
      });
    }

    const requestId = req.params.id;
    const offer = await offerService.submitOffer(requestId, providerOrgId, req.body);
    res.status(201).json({
      data: offer,
      meta: {},
    });
  } catch (e) {
    next(e);
  }
}

async function listOffers(req, res, next) {
  try {
    const providerOrgId = req.user.org_id;
    if (!providerOrgId) {
      return res.status(403).json({
        code: 'FORBIDDEN',
        message: 'Provider organization required',
        details: {},
        requestId: req.id,
      });
    }

    const { status, limit, offset } = req.query;
    const result = await offerService.listOffersForProvider(providerOrgId, { status, limit, offset });
    res.status(200).json({
      data: result.items,
      meta: { total: result.total, limit: result.limit, offset: result.offset },
    });
  } catch (e) {
    next(e);
  }
}

module.exports = { listMatches, getRequest, createOffer, listOffers };

