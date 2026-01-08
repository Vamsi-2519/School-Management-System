
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




// const masterDb = require('../../config/masterDb');
// const { Sequelize } = require('sequelize');
// const OrganizationModel = require('../../model/master/organization');

// // const Organization = OrganizationModel(masterDb, Sequelize.DataTypes);

// exports.onboardSchool = async (req, res) => {
//   try {
//     const { schoolName, schoolCode, email, address } = req.body;

//     const tenantDbName = `school_${schoolCode}`;

//     // create tenant database
//     const tempSequelize = new Sequelize(
//       'postgres',
//       process.env.DB_USER,
//       process.env.DB_PASSWORD,
//       {
//         host: process.env.DB_HOST,
//         dialect: 'postgres',
//       }
//     );

//     await tempSequelize.query(`CREATE DATABASE ${tenantDbName}`);

//     // save in master db
//     const org = await Organization.create({
//       schoolName,
//       schoolCode,
//       email,
//       address,
//       tenantDb: tenantDbName,
//     });

//     res.json({
//       success: true,
//       message: 'School onboarded',
//       org,
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };



const Organization = require('../../model/master/organization');
const { createTenantDatabase, createTenantTables } = require('../../services/tenant.service');

exports.onboardSchool = async (req, res) => {
  try {
    const { schoolName, schoolCode, email, address } = req.body;

    if (!schoolName || !schoolCode || !email || !address) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    const tenantDbName = `school_${schoolCode}`;

    const { Op } = require('sequelize');

    // Ensure uniqueness before attempting to create DB or Organization
    const existing = await Organization.findOne({
      where: {
        [Op.or]: [
          { schoolCode },
          { email },
          { tenantDb: tenantDbName }
        ]
      }
    });

    if (existing) {
      // Determine which field conflicts
      if (existing.schoolCode === schoolCode) {
        return res.status(409).json({ success: false, error: 'schoolCode already exists' });
      }
      if (existing.email === email) {
        return res.status(409).json({ success: false, error: 'email already exists' });
      }
      if (existing.tenantDb === tenantDbName) {
        return res.status(409).json({ success: false, error: 'tenant DB name already exists' });
      }
      return res.status(409).json({ success: false, error: 'Organization already exists' });
    }

    // create tenant DB using the central tenant service (uses master DB connection)
    await createTenantDatabase(tenantDbName);
    // create base tables inside the new tenant DB
    await createTenantTables(tenantDbName);

    // save in master db
    const org = await Organization.create({
      schoolName,
      schoolCode,
      email,
      address,
      tenantDb: tenantDbName
    });

    return res.json({
      success: true,
      message: 'School onboarded successfully',
      org
    });

  } catch (err) {
    console.error(err);
    const code = err && err.parent && err.parent.code;
    if (code === '28P01') {
      return res.status(500).json({
        success: false,
        error: 'Database authentication failed. Check DB_USER / DB_PASSWORD and MASTER_DB_URL.'
      });
    }
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

