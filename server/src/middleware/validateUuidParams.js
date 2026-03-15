const { validate: uuidValidate } = require('uuid');

/**
 * Validates req.params.id and req.params.offer_id (when present) as UUIDs.
 * Invalid UUID -> 400 NOT_FOUND (avoids 500 22P02 from DB).
 */
function validateUuidParams(req, res, next) {
  if (req.params.id && !uuidValidate(req.params.id)) {
    const err = new Error('Invalid request id');
    err.statusCode = 400;
    err.code = 'NOT_FOUND';
    return next(err);
  }
  if (req.params.offer_id && !uuidValidate(req.params.offer_id)) {
    const err = new Error('Invalid offer id');
    err.statusCode = 400;
    err.code = 'NOT_FOUND';
    return next(err);
  }
  next();
}

module.exports = { validateUuidParams };
