// const router = require('express').Router();
// const controller = require('../controllers/marketing/onboarding.controller');

// router.post('/onboard-school', controller.onboardSchool);

// module.exports = router;



const express = require('express');
const router = express.Router();

const { onboardSchool } = require('../controllers/marketing/onboarding.controller');

// POST /api/admin/school → create a new school (tenant)
router.post('/school', onboardSchool);

module.exports = router;
