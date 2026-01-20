const express = require('express');
const router = express.Router();
const { login } = require('../controllers/auth/Login.controller');

// Unified login route (master & tenant)
router.post('/login', login);

module.exports = router;