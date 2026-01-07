const bcrypt = require('bcryptjs');
const jwt = require('../../utils/jwt'); // your JWT utils
const MasterUser = require('../../model/master/Masteruser'); // Master DB user

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Find user in Master DB
    const user = await MasterUser.findOne({ where: { email } });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    if (!user.isActive) return res.status(403).json({ success: false, message: 'Account disabled' });

    // Compare password
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
