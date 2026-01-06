const Organization = require('../../model/master/organization');
const { generateTenantDbName, createTenantDatabase, getTenantSequelize } = require('../../services/tenant.service');

exports.onboardSchool = async (req, res) => {
  try {
    const { schoolName, schoolCode, email } = req.body; // works with form-data now

    if (!schoolName || !schoolCode || !email) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const tenantDb = await generateTenantDbName();

    await Organization.create({ schoolName, schoolCode, email, tenantDb });

    await createTenantDatabase(tenantDb);

    const tenantSequelize = getTenantSequelize(tenantDb);
    await tenantSequelize.authenticate();
    await tenantSequelize.sync();

    return res.json({ success: true, message: 'School onboarded successfully', tenantDb });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Onboarding failed', error: err.message });
  }
};
