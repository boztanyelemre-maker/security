const jwt = require('jsonwebtoken');
const config = require('../config');

function sign(payload, options = {}) {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
    ...options,
  });
}

function verify(token, options = {}) {
  return jwt.verify(token, config.jwtSecret, options);
}

module.exports = {
  sign,
  verify,
};

