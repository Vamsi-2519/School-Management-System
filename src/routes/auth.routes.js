const express = require('express');
const router = express.Router();
const loginController = require('../controllers/auth/Login.controller');

// Unified login route (master & tenant)
router.post('/login', loginController.login);

module.exports = router;