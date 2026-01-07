
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



const { Sequelize } = require('sequelize');
const Organization = require('../../model/master/organization');

exports.onboardSchool = async (req, res) => {
  try {
    const { schoolName, schoolCode, email, address } = req.body;

    if (!schoolName || !schoolCode || !email || !address) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    const tenantDbName = `school_${schoolCode.toLowerCase()}`;

    // connect to postgres default db
    const tempSequelize = new Sequelize(
      'postgres',
      String(process.env.DB_USER),
      String(process.env.DB_PASSWORD),
      {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        dialect: 'postgres',
        logging: false
      }
    );

    // create tenant DB
    await tempSequelize.query(`CREATE DATABASE "${tenantDbName}"`);

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
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

