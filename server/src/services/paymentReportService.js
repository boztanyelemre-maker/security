const { pool } = require('../db/pool');
const { validate: uuidValidate } = require('uuid');

const ALLOWED_STATUSES = ['ON_TIME', 'LATE', 'UNPAID'];

function ensureValidRequestId(requestId) {
  if (!requestId || !uuidValidate(requestId)) {
    const err = new Error('Invalid request id');
    err.statusCode = 400;
    err.code = 'NOT_FOUND';
    throw err;
  }
}

function validatePaymentReport(body) {
  const err = (msg, code = 'VALIDATION_ERROR', details = {}) => {
    const e = new Error(msg);
    e.statusCode = 400;
    e.code = code;
    e.details = details;
    throw e;
  };

  const status = body.status && typeof body.status === 'string' ? body.status.trim().toUpperCase() : null;
  if (!status || !ALLOWED_STATUSES.includes(status)) {
    err('Invalid status', 'VALIDATION_ERROR', { allowed: ALLOWED_STATUSES });
  }

  const note = body.note && typeof body.note === 'string' ? body.note.trim() || null : null;

  return { status, note };
}

async function upsertPaymentReportForRequest(providerOrgId, requestId, body) {
  ensureValidRequestId(requestId);
  if (!pool) {
    const err = new Error('Database not configured');
    err.statusCode = 503;
    err.code = 'SERVICE_UNAVAILABLE';
    throw err;
  }

  // Body validation first (bozuk body → 400 before DB)
  const { status, note } = validatePaymentReport(body);

  const matchRow = await pool.query(
    `SELECT DISTINCT r.request_id, r.buyer_org_id, o.provider_org_id
       FROM offers o
       JOIN requests r ON r.request_id = o.request_id
      WHERE o.request_id = $1
        AND o.provider_org_id = $2
        AND o.status IN ('SUBMITTED','SHORTLISTED','ACCEPTED')`,
    [requestId, providerOrgId]
  );

  if (matchRow.rowCount === 0) {
    const err = new Error('Provider has no offer for this request');
    err.statusCode = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }

  const row = matchRow.rows[0];
  const buyerOrgId = row.buyer_org_id;

  const existing = await pool.query(
    `SELECT payment_report_id
       FROM payment_reports
      WHERE request_id = $1 AND provider_org_id = $2`,
    [requestId, providerOrgId]
  );

  if (existing.rowCount > 0) {
    const id = existing.rows[0].payment_report_id;
    const result = await pool.query(
      `UPDATE payment_reports
          SET status = $1,
              note = $2
        WHERE payment_report_id = $3
        RETURNING payment_report_id, buyer_org_id, provider_org_id, request_id, status, note, created_at`,
      [status, note, id]
    );
    return result.rows[0];
  }

  const insert = await pool.query(
    `INSERT INTO payment_reports (buyer_org_id, provider_org_id, request_id, status, note)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING payment_report_id, buyer_org_id, provider_org_id, request_id, status, note, created_at`,
    [buyerOrgId, providerOrgId, requestId, status, note]
  );

  return insert.rows[0];
}

module.exports = { upsertPaymentReportForRequest };

