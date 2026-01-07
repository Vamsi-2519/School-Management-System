const express = require('express');

const app = express();

// =====================
// Global Middlewares
// =====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================
// Routes
// =====================
const marketingRoutes = require('./src/routes/marketing.routes');

app.use('/api/marketing', marketingRoutes);

// =====================
// Health Check
// =====================
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running'
  });
});

module.exports = app;
