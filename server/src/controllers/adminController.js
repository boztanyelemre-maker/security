const { pool } = require('../db/pool');

async function listRequests(req, res, next) {
  try {
    if (!pool) {
      return res.status(503).json({
        code: 'SERVICE_UNAVAILABLE',
        message: 'Database not configured',
        details: {},
        requestId: req.id,
      });
    }

    const result = await pool.query(
      `SELECT
          r.request_id,
          r.buyer_org_id,
          r.status,
          r.city_id,
          c.name AS city_name,
          r.personnel_count,
          r.budget_min_try,
          r.budget_max_try,
          r.created_at,
          COALESCE(off_cnt.cnt, 0) AS offers_count
       FROM requests r
       JOIN cities c ON c.id = r.city_id
       LEFT JOIN (
         SELECT request_id, COUNT(*) AS cnt
           FROM offers
          GROUP BY request_id
       ) AS off_cnt ON off_cnt.request_id = r.request_id
       WHERE r.status = 'PUBLISHED'
       ORDER BY r.created_at DESC
       LIMIT 100`,
    );

    const items = result.rows.map((row) => ({
      request_id: row.request_id,
      buyer_org_id: row.buyer_org_id,
      status: row.status,
      city_id: row.city_id,
      city: row.city_name,
      personnel_count: row.personnel_count,
      budget_min_try: row.budget_min_try,
      budget_max_try: row.budget_max_try,
      created_at: row.created_at,
      offers_count: row.offers_count,
    }));

    res.status(200).json({
      data: items,
      meta: { total: items.length },
    });
  } catch (e) {
    next(e);
  }
}

async function listOffers(req, res, next) {
  try {
    if (!pool) {
      return res.status(503).json({
        code: 'SERVICE_UNAVAILABLE',
        message: 'Database not configured',
        details: {},
        requestId: req.id,
      });
    }

    const result = await pool.query(
      `SELECT
          o.id AS offer_id,
          o.request_id,
          o.provider_org_id,
          o.total_price_try,
          o.status,
          o.created_at,
          r.budget_min_try,
          r.budget_max_try,
          rf.severity,
          rf.flag_type
       FROM offers o
       JOIN requests r ON r.request_id = o.request_id
       LEFT JOIN risk_flags rf
         ON rf.entity_type = 'OFFER'
        AND rf.entity_id = o.id
        AND rf.flag_type = 'TOO_LOW_OFFER'
        AND rf.status = 'OPEN'
       ORDER BY o.created_at DESC
       LIMIT 100`,
    );

    const items = result.rows.map((row) => {
      const amount = row.total_price_try;
      const min = row.budget_min_try;
      const max = row.budget_max_try;
      let budget_band = null;
      if (amount != null && min != null && max != null) {
        const x = Number(amount);
        const minN = Number(min);
        const maxN = Number(max);
        const tol = 0.05;
        if (Number.isFinite(x) && Number.isFinite(minN) && Number.isFinite(maxN)) {
          if (x >= minN && x <= maxN) budget_band = 'IN';
          else if (x >= minN * (1 - tol) && x < minN) budget_band = 'EDGE';
          else if (x > maxN && x <= maxN * (1 + tol)) budget_band = 'EDGE';
          else budget_band = 'OUT';
        }
      }

      let risk_band = 'NORMAL';
      if (row.severity === 'CRITICAL') risk_band = 'CRITICAL';
      else if (row.severity) risk_band = 'WATCH';

      return {
        offer_id: row.offer_id,
        request_id: row.request_id,
        provider_org_id: row.provider_org_id,
        total_price_try: row.total_price_try,
        risk_band,
        budget_band,
        status: row.status,
        created_at: row.created_at,
      };
    });

    res.status(200).json({
      data: items,
      meta: { total: items.length },
    });
  } catch (e) {
    next(e);
  }
}

async function listRiskFlags(req, res, next) {
  try {
    if (!pool) {
      return res.status(503).json({
        code: 'SERVICE_UNAVAILABLE',
        message: 'Database not configured',
        details: {},
        requestId: req.id,
      });
    }

    const result = await pool.query(
      `SELECT id, entity_type, entity_id, reason, severity, created_at
         FROM risk_flags
        ORDER BY created_at DESC
        LIMIT 100`,
    );

    const items = result.rows.map((row) => ({
      risk_flag_id: row.id,
      entity_type: row.entity_type,
      entity_id: row.entity_id,
      reason: row.reason,
      severity: row.severity,
      created_at: row.created_at,
    }));

    res.status(200).json({
      data: items,
      meta: { total: items.length },
    });
  } catch (e) {
    next(e);
  }
}

async function listPaymentReports(req, res, next) {
  try {
    if (!pool) {
      return res.status(503).json({
        code: 'SERVICE_UNAVAILABLE',
        message: 'Database not configured',
        details: {},
        requestId: req.id,
      });
    }

    const result = await pool.query(
      `SELECT payment_report_id, buyer_org_id, provider_org_id, request_id, status, note, created_at
         FROM payment_reports
        ORDER BY created_at DESC
        LIMIT 100`
    );

    const items = result.rows.map((row) => ({
      payment_report_id: row.payment_report_id,
      buyer_org_id: row.buyer_org_id,
      provider_org_id: row.provider_org_id,
      request_id: row.request_id,
      status: row.status,
      note: row.note,
      created_at: row.created_at,
    }));

    res.status(200).json({
      data: items,
      meta: { total: items.length },
    });
  } catch (e) {
    next(e);
  }
}

module.exports = { listRequests, listOffers, listRiskFlags, listPaymentReports };

