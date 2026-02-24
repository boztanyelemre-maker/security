const requestService = require('../services/requestService');

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
    const buyerOrgId = req.user.org_id;
    if (!buyerOrgId) {
      return res.status(403).json({
        code: 'FORBIDDEN',
        message: 'Buyer organization required',
        details: {},
        requestId: req.id,
      });
    }

    const requestId = req.params.id;
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
    const buyerOrgId = req.user.org_id;
    if (!buyerOrgId) {
      return res.status(403).json({
        code: 'FORBIDDEN',
        message: 'Buyer organization required',
        details: {},
        requestId: req.id,
      });
    }

    const requestId = req.params.id;
    const result = await requestService.getRequest(buyerOrgId, requestId);
    res.status(200).json({
      data: result,
      meta: {},
    });
  } catch (e) {
    next(e);
  }
}

module.exports = { createRequest, updateRequest, listRequests, getRequest };
