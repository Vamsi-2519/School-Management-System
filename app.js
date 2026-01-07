const express = require('express');
<<<<<<< HEAD

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
=======
const app = express();

// For JSON body (raw)
app.use(express.json());

// For x-www-form-urlencoded (Postman form-data or x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Example route
app.use('/admin', require('./src/routes/admin.routes'));
>>>>>>> 86eb9e9 (Initial commit)

module.exports = app;
