const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const sweetRoutes = require('./routes/sweetRoutes');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();

// Global middlewares
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);

// 404 handler
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

module.exports = app;
