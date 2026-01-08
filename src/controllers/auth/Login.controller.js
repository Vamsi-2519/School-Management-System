const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const jwt = require('../../utils/jwt'); // your JWT utils
const MasterUser = require('../../model/master/Masteruser'); // Master DB user

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
exports.login = async (req, res) => {
  try {
    // Accept either `email` or `phone`/`username` in body. Normalize email.
    const rawId = req.body.email || req.body.username || req.body.phone;
    const password = req.body.password;

    if (!rawId || !password) {
      return res.status(400).json({ success: false, message: 'Email/phone and password are required' });
    }

    const lookup = rawId.toString().trim();
    const emailLookup = lookup.includes('@') ? lookup.toLowerCase() : null;

    // Find user by email or phone
    const whereClause = emailLookup ? { [Op.or]: [{ email: emailLookup }, { phone: lookup }] } : { phone: lookup };
    const user = await MasterUser.findOne({ where: whereClause });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    if (!user.isActive) return res.status(403).json({ success: false, message: 'Account disabled' });

    // Compare password (user.password should be hashed). Guard null.
    if (!user.password) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    // update last login
    try { await user.update({ lastLogin: new Date() }); } catch (uErr) { console.warn('Failed updating lastLogin', uErr.message); }

    // Create JWT token
    const token = jwt.sign({ id: user.id, role: user.role, email: user.email });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        schoolCode: user.schoolCode
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Login failed', error: err.message });
  }
};
