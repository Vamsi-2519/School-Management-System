const { getTenantSequelize, verifyTenantConnection } = require('../services/tenant.service');

/**
 * Middleware to attach tenant database connection to request
 * Usage: router.get('/api/students', tenantDbMiddleware, getStudents)
 */
const tenantDbMiddleware = async (req, res, next) => {
  try {
    // Get tenant database name from query, body, or header
    const tenantDbName = req.query.tenantDbName || req.body.tenantDbName || req.headers['x-tenant-db'];

    if (!tenantDbName) {
      return res.status(400).json({
        success: false,
        error: 'Tenant database name is required (tenantDbName query param, body field, or x-tenant-db header)'
      });
    }

    // Verify connection to tenant database
    try {
      await verifyTenantConnection(tenantDbName);
    } catch (err) {
      return res.status(503).json({
        success: false,
        error: `Cannot access tenant database "${tenantDbName}". The database may not exist or be properly initialized. Please contact support or re-onboard.`
      });
    }

    // Attach to request for use in controllers
    req.tenantSequelize = getTenantSequelize(tenantDbName);
    req.tenantDbName = tenantDbName;

    next();
  } catch (error) {
    console.error('Tenant middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

module.exports = {
  tenantDbMiddleware
};
