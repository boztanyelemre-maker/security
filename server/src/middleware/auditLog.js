const { logger } = require('./requestLogger');

/**
 * Audit log: register, login, publish, offer_submit, shortlist, reject, payment_report_submit
 * req.log varsa onu kullanır (requestId dahil), yoksa global logger.
 */
function auditLog(req, action, data = {}) {
  const log = req && req.log ? req.log : logger;
  const payload = {
    audit: true,
    action,
    requestId: req && req.id ? req.id : undefined,
    ...data,
  };
  log.info(payload, `audit: ${action}`);
}

module.exports = { auditLog };
