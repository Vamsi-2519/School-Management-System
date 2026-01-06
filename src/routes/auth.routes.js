const express = require('express');
const router = express.Router();
const SchoolAdmin  = require('../controllers/auth/Login.controller');

router.post('/Adminlogin', SchoolAdmin.loginSchoolAdmin);


module.exports = router;
