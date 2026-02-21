/**
 * Global error handler — tek tip JSON: { code, message, details, requestId }
 */
function errorHandler(err, req, res, next) {
  const requestId = req.id || 'unknown';
  const { logger } = require('./requestLogger');
  const log = req.log || logger;

  log.error({ err, requestId }, err.message);

  const status = err.statusCode || err.status || 500;
  const code = err.code || (status === 500 ? 'INTERNAL_ERROR' : 'ERROR');
  const message = err.message || 'Internal server error';
  const details = err.details || {};

  res.status(status).json({
    code,
    message,
    details,
    requestId,
  });
}

module.exports = errorHandler;
