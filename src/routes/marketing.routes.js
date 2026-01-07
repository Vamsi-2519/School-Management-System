const express = require('express');
const router = express.Router();
<<<<<<< HEAD

const onboarding = require('../controllers/marketing/onboarding.controller');

router.post('/school',onboarding. onboardSchool);
=======
const  onboardingSchool  = require('../controllers/marketing/onboarding.controller');

router.post('/school_onboard',onboardingSchool. onboardSchool);
>>>>>>> 86eb9e9 (Initial commit)

module.exports = router;
