const { pool } = require('../db/pool');

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

async function listMatchesForProvider(providerOrgId, options = {}) {
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

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total
       FROM request_matches rm
       JOIN requests r ON r.request_id = rm.request_id
      WHERE rm.provider_org_id = $1
        AND rm.budget_fit_band <> 'OUT'
        AND rm.match_status = 'VISIBLE'
        AND r.status = 'PUBLISHED'`,
    [providerOrgId]
  );
  const total = countResult.rows[0].total;

  const result = await pool.query(
    `SELECT
        rm.request_id,
        rm.provider_org_id,
        rm.budget_fit_band,
        rm.overall_fit_score,
        r.service_type,
        r.city_id,
        r.site_type,
        r.personnel_count,
        r.shift_type,
        r.contract_months,
        c.name AS city_name
     FROM request_matches rm
     JOIN requests r ON r.request_id = rm.request_id
     JOIN cities c ON c.id = r.city_id
     WHERE rm.provider_org_id = $1
       AND rm.budget_fit_band <> 'OUT'
       AND rm.match_status = 'VISIBLE'
       AND r.status = 'PUBLISHED'
     ORDER BY rm.overall_fit_score DESC, rm.created_at DESC
     LIMIT $2 OFFSET $3`,
    [providerOrgId, limit, offset]
  );

  const items = result.rows.map((row) => {
    const cityPart = row.city_name || `Şehir #${row.city_id}`;
    const sitePart = row.site_type || 'Lokasyon';
    const maskedAddress = `${cityPart} – ${sitePart}`;

    return {
      request_id: row.request_id,
      service_type: row.service_type,
      city: row.city_name,
      personnel_count: row.personnel_count,
      shift_type: row.shift_type,
      contract_months: row.contract_months,
      match_score: row.overall_fit_score,
      budget_band: row.budget_fit_band,
      masked_address: maskedAddress,
    };
  });

  return { items, total, limit, offset };
}

async function getRequestForProvider(providerOrgId, requestId) {
  if (!pool) {
    const err = new Error('Database not configured');
    err.statusCode = 503;
    err.code = 'SERVICE_UNAVAILABLE';
    throw err;
  }

  const result = await pool.query(
    `SELECT
        rm.request_id,
        rm.provider_org_id,
        rm.budget_fit_band,
        rm.overall_fit_score,
        r.service_type,
        r.city_id,
        r.site_type,
        r.personnel_count,
        r.shift_type,
        r.contract_months,
        c.name AS city_name
     FROM request_matches rm
     JOIN requests r ON r.request_id = rm.request_id
     JOIN cities c ON c.id = r.city_id
     WHERE rm.provider_org_id = $1
       AND rm.request_id = $2
       AND rm.budget_fit_band <> 'OUT'
       AND rm.match_status = 'VISIBLE'
       AND r.status = 'PUBLISHED'`,
    [providerOrgId, requestId]
  );

  if (result.rowCount === 0) {
    const err = new Error('Request not found');
    err.statusCode = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }

  const row = result.rows[0];
  const cityPart = row.city_name || `Şehir #${row.city_id}`;
  const sitePart = row.site_type || 'Lokasyon';
  const maskedAddress = `${cityPart} – ${sitePart}`;

  return {
    request_id: row.request_id,
    service_type: row.service_type,
    city: row.city_name,
    personnel_count: row.personnel_count,
    shift_type: row.shift_type,
    contract_months: row.contract_months,
    match_score: row.overall_fit_score,
    budget_band: row.budget_fit_band,
    masked_address: maskedAddress,
  };
}

module.exports = { listMatchesForProvider, getRequestForProvider };

