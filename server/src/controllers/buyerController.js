const { validate: uuidValidate } = require('uuid');
const requestService = require('../services/requestService');
const { auditLog } = require('../middleware/auditLog');

function badRequestId(res, reqId) {
  return res.status(400).json({
    code: 'NOT_FOUND',
    message: 'Invalid request id',
    details: {},
    requestId: reqId,
  });
}

function badOfferId(res, reqId) {
  return res.status(400).json({
    code: 'NOT_FOUND',
    message: 'Invalid offer id',
    details: {},
    requestId: reqId,
  });
}

async function createRequest(req, res, next) {
  try {
    const buyerOrgId = req.user.org_id;
    if (!buyerOrgId) {
      return res.status(403).json({
        code: 'FORBIDDEN',
        message: 'Buyer organization required',
        details: {},
        requestId: req.id,
      });
    }

    const result = await requestService.createRequest(req.body, buyerOrgId);
    res.status(201).json({
      data: result,
      meta: {},
    });
  } catch (e) {
    next(e);
  }
}

async function updateRequest(req, res, next) {
  try {
    const requestId = req.params.id;
    if (!requestId || !uuidValidate(requestId)) return badRequestId(res, req.id);
    const buyerOrgId = req.user.org_id;
    if (!buyerOrgId) {
      return res.status(403).json({
        code: 'FORBIDDEN',
        message: 'Buyer organization required',
        details: {},
        requestId: req.id,
      });
    }

    const result = await requestService.updateRequest(requestId, req.body, buyerOrgId);
    res.status(200).json({
      data: result,
      meta: {},
    });
  } catch (e) {
    next(e);
  }
}

async function listRequests(req, res, next) {
  try {
    const buyerOrgId = req.user.org_id;
    if (!buyerOrgId) {
      return res.status(403).json({
        code: 'FORBIDDEN',
        message: 'Buyer organization required',
        details: {},
        requestId: req.id,
      });
    }

    const limit = req.query.limit;
    const offset = req.query.offset;
    const status = req.query.status;

    const result = await requestService.listRequests(buyerOrgId, { limit, offset, status });
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
    const requestId = req.params.id;
    if (!requestId || !uuidValidate(requestId)) return badRequestId(res, req.id);
    const buyerOrgId = req.user.org_id;
    if (!buyerOrgId) {
      return res.status(403).json({
        code: 'FORBIDDEN',
        message: 'Buyer organization required',
        details: {},
        requestId: req.id,
      });
    }

    const result = await requestService.getRequest(buyerOrgId, requestId);
    res.status(200).json({
      data: result,
      meta: {},
    });
  } catch (e) {
    next(e);
  }
}

async function publishRequest(req, res, next) {
  try {
    const requestId = req.params.id;
    if (!requestId || !uuidValidate(requestId)) return badRequestId(res, req.id);
    const buyerOrgId = req.user.org_id;
    if (!buyerOrgId) {
      return res.status(403).json({
        code: 'FORBIDDEN',
        message: 'Buyer organization required',
        details: {},
        requestId: req.id,
      });
    }

    const result = await requestService.publishRequest(buyerOrgId, requestId);
    auditLog(req, 'publish', { requestId, buyerOrgId });
    res.status(200).json({
      data: result,
      meta: {},
    });
  } catch (e) {
    next(e);
  }
}

async function listOffersForRequest(req, res, next) {
  try {
    const requestId = req.params.id;
    if (!requestId || !uuidValidate(requestId)) return badRequestId(res, req.id);
    const buyerOrgId = req.user.org_id;
    if (!buyerOrgId) {
      return res.status(403).json({
        code: 'FORBIDDEN',
        message: 'Buyer organization required',
        details: {},
        requestId: req.id,
      });
    }

    const items = await requestService.listOffersForRequest(buyerOrgId, requestId);
    res.status(200).json({
      data: items,
      meta: { total: items.length },
    });
  } catch (e) {
    next(e);
  }
}

async function shortlistOffer(req, res, next) {
  try {
    const requestId = req.params.id;
    const offerId = req.params.offer_id;
    if (!requestId || !uuidValidate(requestId)) return badRequestId(res, req.id);
    if (!offerId || !uuidValidate(offerId)) return badOfferId(res, req.id);
    const buyerOrgId = req.user.org_id;
    if (!buyerOrgId) {
      return res.status(403).json({
        code: 'FORBIDDEN',
        message: 'Buyer organization required',
        details: {},
        requestId: req.id,
      });
    }

    const result = await requestService.shortlistOffer(buyerOrgId, requestId, offerId);
    auditLog(req, 'shortlist', { requestId, offerId, buyerOrgId });
    res.status(200).json({
      data: result,
      meta: {},
    });
  } catch (e) {
    next(e);
  }
}

async function rejectOffer(req, res, next) {
  try {
    const requestId = req.params.id;
    const offerId = req.params.offer_id;
    if (!requestId || !uuidValidate(requestId)) return badRequestId(res, req.id);
    if (!offerId || !uuidValidate(offerId)) return badOfferId(res, req.id);
    const buyerOrgId = req.user.org_id;
    if (!buyerOrgId) {
      return res.status(403).json({
        code: 'FORBIDDEN',
        message: 'Buyer organization required',
        details: {},
        requestId: req.id,
      });
    }

    const result = await requestService.rejectOffer(buyerOrgId, requestId, offerId);
    auditLog(req, 'reject', { requestId, offerId, buyerOrgId });
    res.status(200).json({
      data: result,
      meta: {},
    });
  } catch (e) {
    next(e);
  }
}

module.exports = { createRequest, updateRequest, listRequests, getRequest, publishRequest, listOffersForRequest, shortlistOffer, rejectOffer };
