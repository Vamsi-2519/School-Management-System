// const express = require('express');
// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // 👇 THIS LINE IS MANDATORY
// const authRoutes = require('./src/routes/marketing.routes');
// app.use('/marketing', authRoutes);
// const authRoutes = require('./src/routes/auth.routes');
// app.use('/auth', authRoutes);

// module.exports = app;



// app.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const authRoutes = require('./src/routes/auth.routes');
// const adminRoutes = require('./src/routes/admin.routes');
// const teacherRoutes = require('./src/routes/teacher.routes');
// const parentRoutes = require('./src/routes/parent.routes');
// const marketingRoutes = require('./src/routes/marketing.routes');
// const commonRoutes = require('./src/routes/common.routes');

const app = express();

// Middlewares
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json({ limit: '10mb' })); // Handle JSON payloads
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' })); // Handle form-data

// API versioning
const API_PREFIX = '/api/v1';

// Routes
app.use(`${API_PREFIX}/auth`, authRoutes);
// app.use(`${API_PREFIX}/admin`, adminRoutes);
// app.use(`${API_PREFIX}/teacher`, teacherRoutes);
// app.use(`${API_PREFIX}/parent`, parentRoutes);
// app.use(`${API_PREFIX}/marketing`, marketingRoutes);
// app.use(`${API_PREFIX}/common`, commonRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
