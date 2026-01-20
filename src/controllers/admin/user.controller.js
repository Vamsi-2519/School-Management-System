
const TenantUserModel = require('../../model/tenant/User');
const { getTenantConnection } = require('../../config/tenantManager');
const { Organization } = require('../../model/master');
const { DataTypes } = require('sequelize');

exports.createUser = async (req, res) => {
  try {
    const { email, phone, organizationId } = req.body;

    if (!email || !phone || !organizationId) {
      return res.status(400).json({
        success: false,
        message: 'email, phone, and organizationId are required'
      });
    }

    // 🔹 Find organization by ID
    const organization = await Organization.findByPk(organizationId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Invalid organization ID'
      });
    }

    // 🔹 Connect tenant DB
    const tenantDb = await getTenantConnection({
      database: organization.tenantDb,
      url: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${organization.tenantDb}`
    });

    const User = TenantUserModel(tenantDb, DataTypes);

    // 🔹 Check duplicate
    const exists = await User.findOne({
      where: { email: email.toLowerCase() }
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // 🔹 Create user
    const user = await User.create({
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : null,
      OrganizationId: organization.id
    });

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });

  } catch (err) {
    console.error('CREATE USER ERROR:', err);
    return res.status(500).json({
      success: false,
      message: err.message,
      errors: err.errors || []
    });
  }
};



exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all organizations (all tenants)
    const organizations = await Organization.findAll();

    let allUsers = [];

    for (const org of organizations) {
      try {
        // Connect tenant DB
        const tenantDb = await getTenantConnection({
          database: org.tenantDb,
          url: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${org.tenantDb}`
        });

        const User = TenantUserModel(tenantDb, DataTypes);

        // Fetch users for this tenant
        const users = await User.findAll({
          order: [['createdAt', 'DESC']],
          attributes: ['id', 'email', 'phone', 'createdAt', 'updatedAt'] // Only necessary fields
        });

        // Attach organization info ONE TIME
        const usersWithOrg = users.map(u => ({
          id: u.id,
          email: u.email,
          phone: u.phone,
          createdAt: u.createdAt,
          updatedAt: u.updatedAt,
          organizationId: org.id,
          organizationName: org.name
        }));

        allUsers = allUsers.concat(usersWithOrg);

      } catch (err) {
        console.error(`Error fetching users for org ${org.id}:`, err.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'All users fetched successfully',
      data: allUsers
    });

  } catch (error) {
    console.error('GET ALL USERS ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};


/* ================= GET USER BY ID ================= */
// exports.getUserById = async (req, res) => {
//   try {
//     const { schoolCode, id } = req.params;

//     const organization = await Organization.findOne({
//       where: { schoolCode }
//     });

//     if (!organization) {
//       return res.status(404).json({
//         success: false,
//         message: 'Invalid school code'
//       });
//     }

//     const tenantDb = await getTenantConnection({
//       database: organization.tenantDb,
//       url: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${organization.tenantDb}`
//     });

//     const User = TenantUserModel(tenantDb, DataTypes);

//     const user = await User.findByPk(id, {
//       attributes: { exclude: ['password'] }
//     });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     return res.json({
//       success: true,
//       data: user
//     });

//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: err.message
//     });
//   }
// };



exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Fetch all organizations (all tenants)
    const organizations = await Organization.findAll();

    let foundUser = null;

    for (const org of organizations) {
      try {
        // Connect tenant DB
        const tenantDb = await getTenantConnection({
          database: org.tenantDb,
          url: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${org.tenantDb}`
        });

        const User = TenantUserModel(tenantDb, DataTypes);

        // Find user by ID
        const user = await User.findByPk(id, {
          attributes: ['id', 'email', 'phone', 'createdAt', 'updatedAt']
        });

        if (user) {
          foundUser = {
            ...user.dataValues,
            organizationId: org.id,
            organizationName: org.name
          };
          break; // stop loop once found
        }

      } catch (err) {
        console.error(`Error fetching user in org ${org.id}:`, err.message);
      }
    }

    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: foundUser
    });

  } catch (error) {
    console.error('GET USER BY ID ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
};