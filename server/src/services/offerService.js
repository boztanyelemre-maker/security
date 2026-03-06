const { pool } = require('../db/pool');

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
const ALLOWED_STATUSES = ['SUBMITTED', 'WITHDRAWN', 'HIDDEN_BY_ADMIN', 'ACCEPTED', 'REJECTED'];

function mapOfferRow(row) {
  return {
    offer_id: row.offer_id ?? row.id,
    request_id: row.request_id,
    provider_org_id: row.provider_org_id,
    total_price_try: row.total_price_try ?? (row.monthly_offer_try != null ? Number(row.monthly_offer_try) : null),
    price_breakdown: row.price_breakdown_json,
    notes: row.notes ?? row.note ?? null,
    status: row.status,
    created_at: row.created_at ?? row.submitted_at,
  };
}

function validateSubmitOffer(body) {
  const err = (msg, code = 'VALIDATION_ERROR', details = {}) => {
    const e = new Error(msg);
    e.statusCode = 400;
    e.code = code;
    e.details = details;
    throw e;
  };

  const total_price_try = body.total_price_try != null ? parseInt(body.total_price_try, 10) : NaN;
  if (Number.isNaN(total_price_try) || total_price_try < 0) {
    err('total_price_try must be a non-negative integer');
  }

  let price_breakdown_json = null;
  if (body.price_breakdown != null && typeof body.price_breakdown === 'object') {
    price_breakdown_json = body.price_breakdown;
  }

  const notes = body.notes != null && typeof body.notes === 'string' ? body.notes.trim() || null : null;

  return { total_price_try, price_breakdown_json, notes };
}

async function submitOffer(requestId, providerOrgId, body) {
  if (!pool) {
    const err = new Error('Database not configured');
    err.statusCode = 503;
    err.code = 'SERVICE_UNAVAILABLE';
    throw err;
  }

  const matchRow = await pool.query(
    `SELECT rm.request_id, rm.budget_fit_band
       FROM request_matches rm
       JOIN requests r ON r.request_id = rm.request_id
      WHERE rm.request_id = $1
        AND rm.provider_org_id = $2
        AND rm.match_status = 'VISIBLE'
        AND r.status = 'PUBLISHED'`,
    [requestId, providerOrgId]
  );

  if (matchRow.rowCount === 0) {
    const err = new Error('Request not found or not eligible for offer');
    err.statusCode = 403;
    err.code = 'FORBIDDEN';
    throw err;
  }

  if (matchRow.rows[0].budget_fit_band === 'OUT') {
    const err = new Error('Cannot submit offer for OUT budget band');
    err.statusCode = 403;
    err.code = 'BUDGET_OUT';
    throw err;
  }

  const { total_price_try, price_breakdown_json, notes } = validateSubmitOffer(body);

  const priceBreakdownJson = price_breakdown_json ? JSON.stringify(price_breakdown_json) : null;

  const existing = await pool.query(
    `SELECT 1 FROM offers WHERE request_id = $1 AND provider_org_id = $2`,
    [requestId, providerOrgId]
  );

  let result;
  if (existing.rowCount > 0) {
    // UNIQUE(request_id, provider_org_id) var: aynı satırı güncelle (replace)
    try {
      result = await pool.query(
        `UPDATE offers SET monthly_offer_try = $3::numeric, total_price_try = $4, price_breakdown_json = $5, notes = $6, status = 'SUBMITTED', updated_at = NOW()
         WHERE request_id = $1 AND provider_org_id = $2
         RETURNING *`,
        [requestId, providerOrgId, total_price_try, total_price_try, priceBreakdownJson, notes]
      );
    } catch (e) {
      if (e.code === '42703') {
        result = await pool.query(
          `UPDATE offers SET total_price_try = $3, price_breakdown_json = $4, notes = $5, status = 'SUBMITTED'
           WHERE request_id = $1 AND provider_org_id = $2
           RETURNING *`,
          [requestId, providerOrgId, total_price_try, priceBreakdownJson, notes]
        );
      } else throw e;
    }
  } else {
    try {
      result = await pool.query(
        `INSERT INTO offers (request_id, provider_org_id, monthly_offer_try, total_price_try, price_breakdown_json, notes, status)
         VALUES ($1, $2, $3::numeric, $4, $5, $6, 'SUBMITTED')
         RETURNING *`,
        [
          requestId,
          providerOrgId,
          total_price_try,
          total_price_try,
          priceBreakdownJson,
          notes,
        ]
      );
    } catch (e) {
      if (e.code === '42703') {
        result = await pool.query(
          `INSERT INTO offers (request_id, provider_org_id, total_price_try, price_breakdown_json, notes, status)
           VALUES ($1, $2, $3, $4, $5, 'SUBMITTED')
           RETURNING *`,
          [requestId, providerOrgId, total_price_try, priceBreakdownJson, notes]
        );
      } else throw e;
    }
  }

  const savedRow = result.rows[0];
  const offerId = savedRow.offer_id ?? savedRow.id;
  const offerAmount = savedRow.total_price_try ?? (savedRow.monthly_offer_try != null ? Number(savedRow.monthly_offer_try) : null);

  if (offerId != null && offerAmount != null && typeof offerAmount === 'number') {
    try {
      const reqRow = await pool.query(
        'SELECT budget_min_try FROM requests WHERE request_id = $1',
        [requestId]
      );
      if (reqRow.rowCount > 0 && reqRow.rows[0].budget_min_try != null) {
        const budgetMin = Number(reqRow.rows[0].budget_min_try);
        if (budgetMin > 0) {
          let severity = null;
          if (offerAmount < budgetMin * 0.7) severity = 'CRITICAL';
          else if (offerAmount < budgetMin * 0.8) severity = 'HIGH';
          if (severity) {
            await pool.query(
              `INSERT INTO risk_flags (entity_type, entity_id, flag_type, severity, status, created_by)
               VALUES ('OFFER', $1, 'TOO_LOW_OFFER', $2, 'OPEN', 'SYSTEM')`,
              [offerId, severity]
            );
          }
        }
      }
    } catch (_) {
      // risk_flags tablosu yoksa veya insert hata verirse teklif akışını bozma (opsiyonel)
    }
  }

  return mapOfferRow(savedRow);
}

async function listOffersForProvider(providerOrgId, options = {}) {
  if (!pool) {
    const err = new Error('Database not configured');
    err.statusCode = 503;
    err.code = 'SERVICE_UNAVAILABLE';
    throw err;
  }

  let limit = options.limit != null ? parseInt(options.limit, 10) : DEFAULT_LIMIT;
  if (Number.isNaN(limit) || limit < 1) limit = DEFAULT_LIMIT;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;

  let offset = options.offset != null ? parseInt(options.offset, 10) : 0;
  if (Number.isNaN(offset) || offset < 0) offset = 0;

  const status = options.status != null && typeof options.status === 'string'
    ? options.status.trim().toUpperCase()
    : null;
  if (status && !ALLOWED_STATUSES.includes(status)) {
    const err = new Error('Invalid status filter');
    err.statusCode = 400;
    err.code = 'VALIDATION_ERROR';
    err.details = { allowed: ALLOWED_STATUSES };
    throw err;
  }

  const countParams = [providerOrgId];
  const listParams = [providerOrgId];
  let statusCondition = '';
  if (status) {
    statusCondition = ' AND o.status = $2';
    countParams.push(status);
    listParams.push(status);
  }

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM offers o WHERE o.provider_org_id = $1${statusCondition}`,
    countParams
  );
  const total = countResult.rows[0].total;

  listParams.push(limit, offset);
  const limitIdx = listParams.length - 1;
  const offsetIdx = listParams.length;

  const result = await pool.query(
    `SELECT o.* FROM offers o
     WHERE o.provider_org_id = $1${statusCondition}
     ORDER BY COALESCE(o.created_at, o.submitted_at) DESC NULLS LAST
     LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
    listParams
  );

  const items = result.rows.map(mapOfferRow);
  return { items, total, limit, offset };
}

module.exports = { submitOffer, validateSubmitOffer, listOffersForProvider };
