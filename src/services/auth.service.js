const bcrypt = require('bcryptjs');
const jwt = require('../utils/jwt');
const redis = require('./redis.service');

const { Organization } = require('../model/master');
const { getTenantSequelize } = require('./tenant.service');

const MarketingUser = require('../model/master/MarketingUser');
const SuperAdmin = require('../model/master/SuperAdmin');

module.exports.login = async ({ username, password }) => {

  /**
   * 1️⃣ CHECK MASTER USERS
   */
  let user = await SuperAdmin.findOne({ where: { username } });

  if (user) {
    return buildLoginResponse(user, 'SUPER_ADMIN');
  }

  let marketingUser = await MarketingUser.findOne({ where: { mobile: username } });

  if (marketingUser) {
    return buildLoginResponse(marketingUser, 'MARKETING');
  }

  /**
   * 2️⃣ CHECK TENANT USERS
   */
  const organization = await Organization.findOne({
    where: { isActive: true }
  });

  if (!organization) throw new Error('Organization not found');

  const tenantSequelize = await getTenantSequelize(organization.dbName);
  const User = tenantSequelize.models.User;

  user = await User.findOne({ where: { mobile: username } });

  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  return buildLoginResponse(user, user.role, organization.id);
};

/**
 * COMMON RESPONSE BUILDER
 */
async function buildLoginResponse(user, role, tenantId = null) {
  const payload = {
    userId: user.id,
    role,
    tenantId
  };

  const token = jwt.generateToken(payload);

  // store session in redis
  await redis.set(`session:${user.id}`, JSON.stringify(payload), 86400);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      role,
      tenantId
    }
  };
}
