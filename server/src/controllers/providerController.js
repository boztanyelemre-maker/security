const { validate: uuidValidate } = require('uuid');
const providerService = require('../services/providerService');
const offerService = require('../services/offerService');
const paymentReportService = require('../services/paymentReportService');
const { auditLog } = require('../middleware/auditLog');

function badRequestId(res, reqId) {
  return res.status(400).json({
    code: 'NOT_FOUND',
    message: 'Invalid request id',
    details: {},
    requestId: reqId,
  });
}

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
    const requestId = req.params.id;
    if (!requestId || !uuidValidate(requestId)) return badRequestId(res, req.id);
    const providerOrgId = req.user.org_id;
    if (!providerOrgId) {
      return res.status(403).json({
        code: 'FORBIDDEN',
        message: 'Provider organization required',
        details: {},
        requestId: req.id,
      });
    }

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
    const requestId = req.params.id;
    if (!requestId || !uuidValidate(requestId)) return badRequestId(res, req.id);
    const providerOrgId = req.user.org_id;
    if (!providerOrgId) {
      return res.status(403).json({
        code: 'FORBIDDEN',
        message: 'Provider organization required',
        details: {},
        requestId: req.id,
      });
    }
    // Body validation in controller so 400 is returned before any DB call
    const price = req.body?.total_price_try != null ? parseInt(req.body.total_price_try, 10) : NaN;
    if (Number.isNaN(price) || price <= 0) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'total_price_try must be a positive integer',
        details: {},
        requestId: req.id,
      });
    }

    const offer = await offerService.submitOffer(requestId, providerOrgId, req.body);
    auditLog(req, 'offer_submit', { requestId, providerOrgId, offerId: offer?.offer_id ?? offer?.id });
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

async function createPaymentReport(req, res, next) {
  try {
    const requestId = req.params.id;
    if (!requestId || !uuidValidate(requestId)) return badRequestId(res, req.id);
    const providerOrgId = req.user.org_id;
    if (!providerOrgId) {
      return res.status(403).json({
        code: 'FORBIDDEN',
        message: 'Provider organization required',
        details: {},
        requestId: req.id,
      });
    }

    const report = await paymentReportService.upsertPaymentReportForRequest(providerOrgId, requestId, req.body);
    auditLog(req, 'payment_report_submit', { requestId, providerOrgId, status: req.body?.status });
    res.status(201).json({
      data: report,
      meta: {},
    });
  } catch (e) {
    next(e);
  }
}

module.exports = { listMatches, getRequest, createOffer, listOffers, createPaymentReport };

