const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const MasterUser = require('../../model/master/Masteruser');
const Organization = require('../../model/master/organization');
const { getTenantConnection } = require('../../config/tenantManager');
const TenantUserModel = require('../../model/tenant/User');

exports.login = async (req, res) => {
  try {
    const { email, phone, password, schoolCode } = req.body;

    if ((!email && !phone) || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone and password are required'
      });
    }

    // Normalize inputs
    const normalizedEmail = email ? email.trim().toLowerCase() : null;
    const normalizedPhone = phone ? phone.trim() : null;
    const normalizedSchoolCode = schoolCode ? schoolCode.trim().toUpperCase() : null;

    // 1. Try Master DB
    let user;
    try {
      user = await MasterUser.findOne({
        where: {
          ...(normalizedEmail && { email: normalizedEmail }),
          ...(normalizedPhone && { phone: normalizedPhone })
        }
      });
    } catch (err) {
      console.error('Error querying MasterUser:', err);
      return res.status(500).json({ success: false, message: 'Master DB query error', error: err.message });
    }
    let userType = 'master';

    // 2. If not found, try Tenant DB (schoolCode required)
    if (!user && normalizedSchoolCode) {
      let organization;
      try {
        organization = await Organization.findOne({ where: { schoolCode: normalizedSchoolCode } });
      } catch (err) {
        console.error('Error querying Organization:', err);
        return res.status(500).json({ success: false, message: 'Organization query error', error: err.message });
      }
      if (!organization || !organization.tenantDb) {
        return res.status(404).json({ success: false, message: 'Invalid school code or tenant DB not configured' });
      }
      let tenantDb;
      try {
        let connectionString = process.env.TENANT_DB_URL;
        if (!connectionString) {
          // Build connection string dynamically from .env values
          const dbUser = process.env.DB_USER || 'postgres';
          const dbPass = process.env.DB_PASSWORD || process.env.DB_PASS || '';
          const dbHost = process.env.DB_HOST || 'localhost';
          const dbPort = process.env.DB_PORT || '5432';
          connectionString = `postgres://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${organization.tenantDb}`;
        }
        tenantDb = await getTenantConnection({
          database: organization.tenantDb,
          url: connectionString
        });
      } catch (err) {
        console.error('Error connecting to tenant DB:', err);
        return res.status(500).json({ success: false, message: 'Tenant DB connection error', error: err.message });
      }
      let TenantUser;
      try {
        TenantUser = TenantUserModel(tenantDb, require('sequelize').DataTypes);
      } catch (err) {
        console.error('Error initializing TenantUser model:', err);
        return res.status(500).json({ success: false, message: 'TenantUser model error', error: err.message });
      }
      try {
        user = await TenantUser.findOne({
          where: {
            ...(normalizedEmail && { email: normalizedEmail }),
            ...(normalizedPhone && { phone: normalizedPhone })
          }
        });
      } catch (err) {
        console.error('Error querying TenantUser:', err);
        return res.status(500).json({ success: false, message: 'Tenant DB query error', error: err.message });
      }
      userType = 'tenant';
    }

    if (!user) {
      // For tenant login, show available emails for debugging
      let allTenantUsers = [];
      try {
        // Use the organization variable from the previous scope
        let orgTenantDb = userType === 'tenant' && req.body.schoolCode ? normalizedSchoolCode : null;
        let connectionString = process.env.TENANT_DB_URL;
        if (!connectionString && orgTenantDb) {
          const dbUser = process.env.DB_USER || 'postgres';
          const dbPass = process.env.DB_PASSWORD || process.env.DB_PASS || '';
          const dbHost = process.env.DB_HOST || 'localhost';
          const dbPort = process.env.DB_PORT || '5432';
          connectionString = `postgres://${dbUser}:${dbPass}@${dbHost}:${dbPort}/school_${orgTenantDb}`;
        }
        if (connectionString) {
          const tenantDb = await getTenantConnection({
            database: `school_${orgTenantDb}`,
            url: connectionString
          });
          const TenantUser = TenantUserModel(tenantDb, require('sequelize').DataTypes);
          allTenantUsers = await TenantUser.findAll();
        }
      } catch (err) {
        console.error('Error fetching all tenant users:', err);
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Password check
    try {
      if (!user.password || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } catch (err) {
      console.error('Error comparing password:', err);
      return res.status(500).json({ success: false, message: 'Password check error', error: err.message });
    }

    // Account active check (if present)
    if (user.isActive !== undefined && !user.isActive) {
      return res.status(403).json({ success: false, message: 'Account inactive' });
    }

    // JWT payload
    const tokenPayload = {
      id: user.id,
      role: user.role,
      email: user.email,
      phone: user.phone,
      userType,
      ...(userType === 'tenant' && { schoolCode: normalizedSchoolCode })
    };

    let token;
    try {
      token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1d' });
    } catch (err) {
      console.error('Error signing JWT:', err);
      return res.status(500).json({ success: false, message: 'JWT signing error', error: err.message });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: tokenPayload
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};





// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { Op } = require('sequelize');

// const MasterUser = require('../../model/master/Masteruser');
// const Organization = require('../../model/master/organization');
// const { getTenantConnection } = require('../../config/tenantManager');
// const TenantUserModel = require('../../model/tenant/User');

// exports.login = async (req, res) => {
//   try {
//     console.log('LOGIN BODY:', req.body);

//     const { email, phone, password, schoolCode } = req.body;

//     if ((!email && !phone) || !password) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email or phone and password required'
//       });
//     }

//     const normalizedEmail = email?.trim().toLowerCase();
//     const normalizedPhone = phone?.trim();
//     const normalizedSchoolCode = schoolCode?.trim().toUpperCase();

//     const whereCondition = {
//       [Op.or]: [
//         ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
//         ...(normalizedPhone ? [{ phone: normalizedPhone }] : [])
//       ]
//     };

//     console.log('WHERE CONDITION:', whereCondition);

//     let user = await MasterUser.findOne({ where: whereCondition });
//     let userType = 'master';
//     let organization = null;

//     console.log('MASTER USER:', user ? user.email : 'NOT FOUND');

//     if (!user && normalizedSchoolCode) {
//       organization = await Organization.findOne({
//         where: { schoolCode: normalizedSchoolCode }
//       });

//       console.log('ORGANIZATION:', organization?.tenantDb);

//       if (!organization) {
//         return res.status(404).json({
//           success: false,
//           message: 'Invalid school code'
//         });
//       }

//       const connectionString =
//         `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${organization.tenantDb}`;

//       const tenantDb = await getTenantConnection({
//         database: organization.tenantDb,
//         url: connectionString
//       });

//       const TenantUser = TenantUserModel(
//         tenantDb,
//         require('sequelize').DataTypes
//       );

//       user = await TenantUser.findOne({ where: whereCondition });
//       userType = 'tenant';

//       console.log('TENANT USER:', user ? user.email : 'NOT FOUND');
//     }

//     if (!user) {
//       console.log('❌ USER NOT FOUND');
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       });
//     }

//     console.log('DB PASSWORD:', user.password);
//     console.log('INPUT PASSWORD:', password);

//     const isMatch = await bcrypt.compare(password, user.password);
//     console.log('PASSWORD MATCH:', isMatch);

//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       });
//     }

//     const tokenPayload = {
//       id: user.id,
//       role: user.role,
//       email: user.email,
//       phone: user.phone,
//       userType,
//       organizationId: organization?.id || null,
//       schoolCode: normalizedSchoolCode || null
//     };

//     const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
//       expiresIn: '1d'
//     });

//     return res.status(200).json({
//       success: true,
//       message: 'Login successful',
//       token,
//       user: tokenPayload
//     });

//   } catch (err) {
//     console.error('LOGIN ERROR:', err);
//     return res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: err.message
//     });
//   }
// };
