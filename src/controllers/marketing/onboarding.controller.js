<<<<<<< HEAD
// const Organization = require('../../model/master/organization');

// const {
//   createTenantDatabase,
//   createTenantTables
// } = require('../../services/tenant.service');

// exports.onboardSchool = async (req, res) => {
//   try {
//     const { schoolName, schoolCode, email, address } = req.body;

//     if (!schoolName || !schoolCode || !email || !address) {
//       return res.status(400).json({
//         success: false,
//         message: 'All fields are required'
//       });
//     }

//     // 1️⃣ Save school in master DB
//     const school = await Organization.create({
//       schoolName,
//       schoolCode,
//       email,
//       address
//     });

//     // 2️⃣ Create separate DB for school
//     const tenantDbName = `users_${schoolCode.toLowerCase()}`;

//     await createTenantDatabase(tenantDbName);

//     // 3️⃣ Create base tables inside tenant DB
//     await createTenantTables(tenantDbName);

//     return res.status(201).json({
//       success: true,
//       message: 'School onboarded successfully',
//       data: {
//         school,
//         database: tenantDbName
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };



const Organization = require('../../model/master/organization');

exports.onboardSchool = async (req, res) => {
  try {
    const { schoolName, schoolCode, email, address } = req.body;

    if (!schoolName || !schoolCode || !email || !address) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const school = await Organization.create({
      schoolName,
      schoolCode,
      email,
      address
    });

    return res.status(201).json({
      success: true,
      data: school
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

=======
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
>>>>>>> 86eb9e9 (Initial commit)
