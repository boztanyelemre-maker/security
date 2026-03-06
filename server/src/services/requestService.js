const { pool } = require('../db/pool');

const SERVICE_TYPES = ['SILAHLI', 'SILAHSIZ', 'VIP', 'MOBIL', 'KARMA'];
const SHIFT_TYPES = ['8', '12', '24'];

function validateCreateRequest(body) {
  const err = (msg, code = 'VALIDATION_ERROR', details = {}) => {
    const e = new Error(msg);
    e.statusCode = 400;
    e.code = code;
    e.details = details;
    throw e;
  };

  const service_type = body.service_type && SERVICE_TYPES.includes(body.service_type) ? body.service_type : null;
  if (!service_type) err('Invalid or missing service_type', 'VALIDATION_ERROR', { allowed: SERVICE_TYPES });

  const city_id = body.city_id != null ? parseInt(body.city_id, 10) : NaN;
  if (Number.isNaN(city_id) || city_id < 1) err('Valid city_id required');

  const address_text = typeof body.address_text === 'string' ? body.address_text.trim() : '';
  if (!address_text) err('address_text required');

  const site_type = typeof body.site_type === 'string' ? body.site_type.trim() : '';
  if (!site_type) err('site_type required');

  const personnel_count = body.personnel_count != null ? parseInt(body.personnel_count, 10) : NaN;
  if (Number.isNaN(personnel_count) || personnel_count < 1) err('personnel_count must be a positive integer');

  const shift_type = body.shift_type != null && SHIFT_TYPES.includes(String(body.shift_type)) ? String(body.shift_type) : null;
  if (!shift_type) err('Invalid or missing shift_type', 'VALIDATION_ERROR', { allowed: SHIFT_TYPES });

  const start_date = body.start_date;
  if (!start_date || typeof start_date !== 'string') err('start_date required (YYYY-MM-DD)');
  const startDateParsed = new Date(start_date);
  if (Number.isNaN(startDateParsed.getTime())) err('start_date must be valid date (YYYY-MM-DD)');

  const contract_months = body.contract_months != null ? parseInt(body.contract_months, 10) : NaN;
  if (Number.isNaN(contract_months) || contract_months < 1) err('contract_months must be a positive integer');

  const budget_min_try = body.budget_min_try != null ? parseInt(body.budget_min_try, 10) : NaN;
  if (Number.isNaN(budget_min_try) || budget_min_try < 0) err('budget_min_try must be a non-negative integer');

  const budget_max_try = body.budget_max_try != null ? parseInt(body.budget_max_try, 10) : NaN;
  if (Number.isNaN(budget_max_try) || budget_max_try < 0) err('budget_max_try must be a non-negative integer');

  if (budget_max_try < budget_min_try) err('budget_max_try must be >= budget_min_try');

  const subcontract_allowed = typeof body.subcontract_allowed === 'boolean'
    ? body.subcontract_allowed
    : (body.subcontract_allowed === true || body.subcontract_allowed === 'true' || body.subcontract_allowed === 1);

  let subcontract_percent = null;
  if (body.subcontract_percent != null && body.subcontract_percent !== '') {
    subcontract_percent = parseInt(body.subcontract_percent, 10);
    if (Number.isNaN(subcontract_percent) || subcontract_percent < 0 || subcontract_percent > 100) {
      err('subcontract_percent must be 0-100 or omitted');
    }
  }

  return {
    service_type,
    city_id,
    address_text,
    site_type,
    personnel_count,
    shift_type,
    start_date: start_date.trim(),
    contract_months,
    budget_min_try,
    budget_max_try,
    subcontract_allowed,
    subcontract_percent,
  };
}

async function createRequest(body, buyerOrgId) {
  if (!pool) {
    const err = new Error('Database not configured');
    err.statusCode = 503;
    err.code = 'SERVICE_UNAVAILABLE';
    throw err;
  }

  const data = validateCreateRequest(body);

  const result = await pool.query(
    `INSERT INTO requests (
      buyer_org_id, status, service_type, city_id, address_text, site_type,
      personnel_count, shift_type, start_date, contract_months,
      budget_min_try, budget_max_try, subcontract_allowed, subcontract_percent
    ) VALUES ($1, 'DRAFT', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING request_id, buyer_org_id, status, service_type, city_id, address_text, site_type,
      personnel_count, shift_type, start_date, contract_months,
      budget_min_try, budget_max_try, subcontract_allowed, subcontract_percent, created_at`,
    [
      buyerOrgId,
      data.service_type,
      data.city_id,
      data.address_text,
      data.site_type,
      data.personnel_count,
      data.shift_type,
      data.start_date,
      data.contract_months,
      data.budget_min_try,
      data.budget_max_try,
      data.subcontract_allowed,
      data.subcontract_percent,
    ]
  );

  const row = result.rows[0];
  return {
    request_id: row.request_id,
    buyer_org_id: row.buyer_org_id,
    status: row.status,
    service_type: row.service_type,
    city_id: row.city_id,
    address_text: row.address_text,
    site_type: row.site_type,
    personnel_count: row.personnel_count,
    shift_type: row.shift_type,
    start_date: row.start_date,
    contract_months: row.contract_months,
    budget_min_try: row.budget_min_try,
    budget_max_try: row.budget_max_try,
    subcontract_allowed: row.subcontract_allowed,
    subcontract_percent: row.subcontract_percent,
    created_at: row.created_at,
  };
}

async function updateRequest(requestId, body, buyerOrgId) {
  if (!pool) {
    const err = new Error('Database not configured');
    err.statusCode = 503;
    err.code = 'SERVICE_UNAVAILABLE';
    throw err;
  }

  const existing = await pool.query(
    'SELECT request_id, buyer_org_id, status FROM requests WHERE request_id = $1',
    [requestId]
  );

  if (existing.rowCount === 0) {
    const err = new Error('Request not found');
    err.statusCode = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }

  const row = existing.rows[0];
  if (row.buyer_org_id !== buyerOrgId) {
    const err = new Error('Request not found');
    err.statusCode = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }

  if (row.status !== 'DRAFT') {
    const err = new Error('Request is not editable');
    err.statusCode = 409;
    err.code = 'REQUEST_NOT_EDITABLE';
    err.details = { status: row.status };
    throw err;
  }

  const data = validateCreateRequest(body);

  const result = await pool.query(
    `UPDATE requests SET
      service_type = $2, city_id = $3, address_text = $4, site_type = $5,
      personnel_count = $6, shift_type = $7, start_date = $8, contract_months = $9,
      budget_min_try = $10, budget_max_try = $11,
      subcontract_allowed = $12, subcontract_percent = $13,
      updated_at = NOW()
    WHERE request_id = $1 AND buyer_org_id = $14 AND status = 'DRAFT'
    RETURNING request_id, buyer_org_id, status, service_type, city_id, address_text, site_type,
      personnel_count, shift_type, start_date, contract_months,
      budget_min_try, budget_max_try, subcontract_allowed, subcontract_percent, created_at, updated_at`,
    [
      requestId,
      data.service_type,
      data.city_id,
      data.address_text,
      data.site_type,
      data.personnel_count,
      data.shift_type,
      data.start_date,
      data.contract_months,
      data.budget_min_try,
      data.budget_max_try,
      data.subcontract_allowed,
      data.subcontract_percent,
      buyerOrgId,
    ]
  );

  if (result.rowCount === 0) {
    const err = new Error('Request not found');
    err.statusCode = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }

  const updated = result.rows[0];
  return {
    request_id: updated.request_id,
    buyer_org_id: updated.buyer_org_id,
    status: updated.status,
    service_type: updated.service_type,
    city_id: updated.city_id,
    address_text: updated.address_text,
    site_type: updated.site_type,
    personnel_count: updated.personnel_count,
    shift_type: updated.shift_type,
    start_date: updated.start_date,
    contract_months: updated.contract_months,
    budget_min_try: updated.budget_min_try,
    budget_max_try: updated.budget_max_try,
    subcontract_allowed: updated.subcontract_allowed,
    subcontract_percent: updated.subcontract_percent,
    created_at: updated.created_at,
    updated_at: updated.updated_at,
  };
}

const VALID_STATUSES = ['DRAFT', 'PUBLISHED', 'CLOSED'];
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

async function listRequests(buyerOrgId, options = {}) {
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

  const status = options.status && VALID_STATUSES.includes(options.status) ? options.status : null;

  const countResult = await pool.query(
    status
      ? 'SELECT COUNT(*)::int AS total FROM requests WHERE buyer_org_id = $1 AND status = $2'
      : 'SELECT COUNT(*)::int AS total FROM requests WHERE buyer_org_id = $1',
    status ? [buyerOrgId, status] : [buyerOrgId]
  );
  const total = countResult.rows[0].total;

  const listResult = await pool.query(
    status
      ? `SELECT request_id, buyer_org_id, status, service_type, city_id, address_text, site_type,
         personnel_count, shift_type, start_date, contract_months, budget_min_try, budget_max_try,
         subcontract_allowed, subcontract_percent, created_at, updated_at
         FROM requests WHERE buyer_org_id = $1 AND status = $2 ORDER BY created_at DESC LIMIT $3 OFFSET $4`
      : `SELECT request_id, buyer_org_id, status, service_type, city_id, address_text, site_type,
         personnel_count, shift_type, start_date, contract_months, budget_min_try, budget_max_try,
         subcontract_allowed, subcontract_percent, created_at, updated_at
         FROM requests WHERE buyer_org_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    status ? [buyerOrgId, status, limit, offset] : [buyerOrgId, limit, offset]
  );

  const items = listResult.rows.map((row) => ({
    request_id: row.request_id,
    buyer_org_id: row.buyer_org_id,
    status: row.status,
    service_type: row.service_type,
    city_id: row.city_id,
    address_text: row.address_text,
    site_type: row.site_type,
    personnel_count: row.personnel_count,
    shift_type: row.shift_type,
    start_date: row.start_date,
    contract_months: row.contract_months,
    budget_min_try: row.budget_min_try,
    budget_max_try: row.budget_max_try,
    subcontract_allowed: row.subcontract_allowed,
    subcontract_percent: row.subcontract_percent,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));

  return { items, total, limit, offset };
}

async function getRequest(buyerOrgId, requestId) {
  if (!pool) {
    const err = new Error('Database not configured');
    err.statusCode = 503;
    err.code = 'SERVICE_UNAVAILABLE';
    throw err;
  }

  const result = await pool.query(
    `SELECT request_id, buyer_org_id, status, service_type, city_id, address_text, site_type,
            personnel_count, shift_type, start_date, contract_months, budget_min_try, budget_max_try,
            subcontract_allowed, subcontract_percent, created_at, updated_at
       FROM requests
      WHERE request_id = $1 AND buyer_org_id = $2`,
    [requestId, buyerOrgId]
  );

  if (result.rowCount === 0) {
    const err = new Error('Request not found');
    err.statusCode = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }

  const row = result.rows[0];
  return {
    request_id: row.request_id,
    buyer_org_id: row.buyer_org_id,
    status: row.status,
    service_type: row.service_type,
    city_id: row.city_id,
    address_text: row.address_text,
    site_type: row.site_type,
    personnel_count: row.personnel_count,
    shift_type: row.shift_type,
    start_date: row.start_date,
    contract_months: row.contract_months,
    budget_min_try: row.budget_min_try,
    budget_max_try: row.budget_max_try,
    subcontract_allowed: row.subcontract_allowed,
    subcontract_percent: row.subcontract_percent,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

async function publishRequest(buyerOrgId, requestId) {
  if (!pool) {
    const err = new Error('Database not configured');
    err.statusCode = 503;
    err.code = 'SERVICE_UNAVAILABLE';
    throw err;
  }

  const existing = await pool.query(
    `SELECT request_id, buyer_org_id, status, service_type, city_id,
            personnel_count, start_date, contract_months, budget_min_try, budget_max_try
       FROM requests
      WHERE request_id = $1`,
    [requestId]
  );

  if (existing.rowCount === 0) {
    const err = new Error('Request not found');
    err.statusCode = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }

  const row = existing.rows[0];
  if (row.buyer_org_id !== buyerOrgId) {
    const err = new Error('Request not found');
    err.statusCode = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }

  if (row.status !== 'DRAFT') {
    const err = new Error('Request is not publishable');
    err.statusCode = 409;
    err.code = 'REQUEST_NOT_EDITABLE';
    err.details = { status: row.status };
    throw err;
  }

  const missing = [];
  if (!row.service_type) missing.push('service_type');
  if (!row.personnel_count || row.personnel_count <= 0) missing.push('personnel_count');
  if (!row.start_date) missing.push('start_date');
  if (!row.contract_months || row.contract_months <= 0) missing.push('contract_months');
  if (row.budget_min_try == null) missing.push('budget_min_try');
  if (row.budget_max_try == null) missing.push('budget_max_try');

  if (missing.length > 0) {
    const err = new Error('Request is incomplete');
    err.statusCode = 400;
    err.code = 'REQUEST_INCOMPLETE';
    err.details = { missing };
    throw err;
  }

  // Basit matching engine v1: sadece OUT band eşleşmeleri kaydedilir
  const providersRes = await pool.query(
    `SELECT o.id AS provider_org_id,
            o.hq_city_id,
            o.status,
            pp.min_monthly_price_try
       FROM organizations o
       JOIN provider_profiles pp ON pp.organization_id = o.id
      WHERE o.org_type = 'PROVIDER'
        AND o.status = 'ACTIVE'
        AND o.hq_city_id = $1
        AND pp.min_monthly_price_try IS NOT NULL`,
    [row.city_id]
  );

  const budgetMin = Number(row.budget_min_try);
  const budgetMax = Number(row.budget_max_try);
  const lowerEdge = budgetMin * 0.85;
  const upperEdge = budgetMax * 1.15;

  for (const prov of providersRes.rows) {
    const price = Number(prov.min_monthly_price_try);
    let band = 'OUT';
    if (price >= budgetMin && price <= budgetMax) {
      band = 'IN';
    } else if (
      (price >= lowerEdge && price < budgetMin) ||
      (price > budgetMax && price <= upperEdge)
    ) {
      band = 'EDGE';
    } else {
      band = 'OUT';
    }

    if (band === 'OUT') {
      await pool.query(
        `INSERT INTO request_matches (request_id, provider_org_id)
         VALUES ($1, $2)
         ON CONFLICT (request_id, provider_org_id) DO NOTHING`,
        [requestId, prov.provider_org_id]
      );
    }
  }

  const matchesCountRes = await pool.query(
    'SELECT COUNT(*)::int AS cnt FROM request_matches WHERE request_id = $1',
    [requestId]
  );
  const matchCount = matchesCountRes.rows[0].cnt;

  const result = await pool.query(
    `UPDATE requests
        SET status = 'PUBLISHED',
            updated_at = NOW()
      WHERE request_id = $1 AND buyer_org_id = $2 AND status = 'DRAFT'
      RETURNING request_id, buyer_org_id, status, service_type, city_id, address_text, site_type,
                personnel_count, shift_type, start_date, contract_months, budget_min_try, budget_max_try,
                subcontract_allowed, subcontract_percent, created_at, updated_at`,
    [requestId, buyerOrgId]
  );

  if (result.rowCount === 0) {
    const err = new Error('Request not found');
    err.statusCode = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }

  const updated = result.rows[0];
  return {
    status: updated.status,
    match_count: matchCount,
  };
}

function mapOfferForBuyer(row) {
  return {
    offer_id: row.offer_id ?? row.id,
    request_id: row.request_id,
    provider_org_id: row.provider_org_id,
    provider_legal_name: row.provider_legal_name ?? null,
    total_price_try: row.total_price_try ?? (row.monthly_offer_try != null ? Number(row.monthly_offer_try) : null),
    price_breakdown: row.price_breakdown_json,
    notes: row.notes ?? row.note ?? null,
    status: row.status,
    created_at: row.created_at ?? row.submitted_at,
  };
}

async function listOffersForRequest(buyerOrgId, requestId) {
  if (!pool) {
    const err = new Error('Database not configured');
    err.statusCode = 503;
    err.code = 'SERVICE_UNAVAILABLE';
    throw err;
  }

  const result = await pool.query(
    `SELECT o.*, org.legal_name AS provider_legal_name
       FROM offers o
       JOIN requests r ON r.request_id = o.request_id
       JOIN organizations org ON org.id = o.provider_org_id
      WHERE o.request_id = $1 AND r.buyer_org_id = $2
      ORDER BY COALESCE(o.created_at, o.submitted_at) DESC NULLS LAST`,
    [requestId, buyerOrgId]
  );

  if (result.rowCount === 0) {
    const reqCheck = await pool.query(
      'SELECT 1 FROM requests WHERE request_id = $1 AND buyer_org_id = $2',
      [requestId, buyerOrgId]
    );
    if (reqCheck.rowCount === 0) {
      const err = new Error('Request not found');
      err.statusCode = 404;
      err.code = 'NOT_FOUND';
      throw err;
    }
    return [];
  }

  return result.rows.map(mapOfferForBuyer);
}

module.exports = { validateCreateRequest, createRequest, updateRequest, listRequests, getRequest, publishRequest, listOffersForRequest };
