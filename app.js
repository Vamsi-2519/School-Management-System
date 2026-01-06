const express = require('express');
const app = express();

// For JSON body (raw)
app.use(express.json());

// For x-www-form-urlencoded (Postman form-data or x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Example route
app.use('/admin', require('./src/routes/admin.routes'));

module.exports = app;
