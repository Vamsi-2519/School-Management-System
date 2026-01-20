


const express = require('express');
const router = express.Router();

const { onboardSchool, getAllOrganizations,
  getOrganizationById,updateOrganization,
  deleteOrganization } = require('../controllers/marketing/onboarding.controller');

// POST /api/admin/school → create a new school (tenant)
router.post('/school', onboardSchool);
router.get('/getall', getAllOrganizations);
router.get('/getby/:id', getOrganizationById);
router.put('/update/:id', updateOrganization);
router.delete('/delete/:id', deleteOrganization);
module.exports = router;
