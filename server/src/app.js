const express = require('express');
const cors = require('cors');
const { requestIdMiddleware, attachLogger } = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const healthRouter = require('./routes/health');
const authRouter = require('./routes/auth');
const buyerRouter = require('./routes/buyer');
const providerRouter = require('./routes/provider');
const config = require('./config');

const app = express();

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    const allowed = config.corsOrigins.filter(Boolean);
    return allowed.includes(origin) ? cb(null, true) : cb(new Error('CORS blocked'));
  },
  credentials: false,
}));
app.use(express.json({ limit: '1mb' }));
app.use(requestIdMiddleware);
app.use(attachLogger);

app.use('/health', healthRouter);
app.use('/auth', authRouter);
app.use('/buyer', buyerRouter);
app.use('/provider', providerRouter);

app.use((req, res) => {
  res.status(404).json({
    code: 'NOT_FOUND',
    message: 'Not found',
    details: { path: req.path },
    requestId: req.id,
  });
});

app.use(errorHandler);

module.exports = app;
