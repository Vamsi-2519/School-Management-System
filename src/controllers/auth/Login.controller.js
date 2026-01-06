// const Organization = require('../../model/master/organization')
// const user = require('../../model/tenant/User');

// exports.loginSchoolAdmin = async (req, res) => {
//   try {
//     const { schoolCode, email, password } = req.body;

//     const org = await Organization.findOne({
//       where: { schoolCode }   // ✅ correct column
//     });

//     if (!org) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid school code'
//       });
//     }

//     return res.json({
//       success: true,
//       message: 'Login successful',
//       tenantDb: org.tenantDb
//     });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       success: false,
//       message: 'Login failed',
//       error: err.message
//     });
//   }
// };






const jwt = require('jsonwebtoken');
const Organization = require('../../model/master/organization');

exports.loginSchoolAdmin = async (req, res) => {
  try {
    const { schoolCode } = req.body;

    if (!schoolCode) {
      return res.status(400).json({
        success: false,
        message: 'schoolCode is required'
      });
    }

    // 1️⃣ Find organization from MASTER DB
    const org = await Organization.findOne({
      where: { schoolCode }
    });

    if (!org) {
      return res.status(401).json({
        success: false,
        message: 'Invalid school code'
      });
    }

    // 2️⃣ Generate JWT (NO tenant DB touch)
    const token = jwt.sign(
      {
        orgId: org.id,
        schoolCode: org.schoolCode,
        tenantDb: org.tenantDb,
        role: 'SCHOOL_ADMIN'
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d'
      }
    );

    // 3️⃣ Response
    return res.json({
      success: true,
      message: 'Login successful',
      token,
      tenantDb: org.tenantDb
    });

  } catch (err) {
    console.error('LOGIN ERROR:', err);
    return res.status(500).json({
      success: false,
      message: 'Login failed',
      error: err.message
    });
  }
};
