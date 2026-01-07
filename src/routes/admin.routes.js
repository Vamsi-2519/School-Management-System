


// src/routes/admin.routes.js  (or student.routes.js)
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/admin/student.controller');

// Example route
router.post('/students', studentController.createStudent);

module.exports = router;
