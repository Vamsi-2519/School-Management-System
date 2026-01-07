const express = require('express');
const router = express.Router();

const onboarding = require('../controllers/marketing/onboarding.controller');

router.post('/school',onboarding. onboardSchool);

module.exports = router;
