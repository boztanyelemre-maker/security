const buckets = new Map();

function makeKey(id, ip) {
  return `${id}:${ip}`;
}

function rateLimit({ id, windowMs, max }) {
  return (req, res, next) => {
    const now = Date.now();
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const key = makeKey(id, ip);
    const bucket = buckets.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > bucket.resetAt) {
      bucket.count = 0;
      bucket.resetAt = now + windowMs;
    }

    bucket.count += 1;
    buckets.set(key, bucket);

    if (bucket.count > max) {
      return res.status(429).json({
        code: 'RATE_LIMITED',
        message: 'Too many requests, please try again later',
        details: { windowMs, max },
        requestId: req.id,
      });
    }

    next();
  };
}

module.exports = { rateLimit };

