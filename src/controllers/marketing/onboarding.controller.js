
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
        error: 'schoolName, schoolCode, email, address are required'
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

    // save organization in master db AFTER successful database creation
    const org = await Organization.create({
      schoolName,
      schoolCode,
      email,
      address,
      tenantDb: tenantDbName
    });

    console.log('✅ Organization created:', org.id);

    // Admin user creation skipped: no admin password provided
    console.log('⚠️  Admin user not created: no admin password provided during onboarding.');

    // Build response
    const responseData = {
      organization: {
        id: org.id,
        schoolName: org.schoolName,
        schoolCode: org.schoolCode,
        email: org.email,
        tenantDb: org.tenantDb
      }
    };

    // Admin user creation skipped, so no adminUser info to add

    return res.status(201).json({
      success: true,
      message: 'School onboarded successfully!',
      data: responseData
    });

  } catch (err) {
    console.error('❌ Onboarding error:', err.message);
    console.error(err);
    
    // Specific database error handling
    if (err.message && err.message.includes('does not exist')) {
      return res.status(500).json({
        success: false,
        error: 'Tenant database creation failed. Please try again.'
      });
    }
    
    // Check for unique constraint violations
    if (err.errors && err.errors[0]) {
      const errorMsg = err.errors[0].message;
      if (errorMsg.includes('email')) {
        return res.status(409).json({
          success: false,
          error: 'Email already exists. Use a different email.'
        });
      }
      if (errorMsg.includes('schoolCode')) {
        return res.status(409).json({
          success: false,
          error: 'School Code already exists. Use a different code.'
        });
      }
    }
    
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



/**
 * GET ALL ORGANIZATIONS
 * GET /api/v1/organizations
 */
exports.getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.findAll({
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      message: 'Organizations fetched successfully',
      data: organizations
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch organizations',
      error: error.message
    });
  }
};

/**
 * GET ORGANIZATION BY ID
 * GET /api/v1/organizations/:id
 */
exports.getOrganizationById = async (req, res) => {
  try {
    const { id } = req.params;

    const organization = await Organization.findByPk(id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Organization fetched successfully',
      data: organization
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch organization',
      error: error.message
    });
  }
};



exports.updateOrganization = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if organization exists
    const organization = await Organization.findByPk(id);
    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }

    // Update data
    await organization.update(req.body);

    return res.status(200).json({
      success: true,
      message: 'Organization updated successfully',
      data: organization
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update organization',
      error: error.message
    });
  }
};



exports.deleteOrganization = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if organization exists
    const organization = await Organization.findByPk(id);
    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }

    await organization.destroy();

    return res.status(200).json({
      success: true,
      message: 'Organization deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete organization',
      error: error.message
    });
  }
};