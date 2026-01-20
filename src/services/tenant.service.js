const { Sequelize } = require('sequelize');
const Organization = require('../model/master/organization');
const masterSequelize = require('../config/masterDb');

// Cache tenant connections
const tenantConnections = {};

/**
 * Generate tenant database name
 * Example: users_abc001
 */
const generateTenantDbName = async (schoolCode) => {
  return `users_${schoolCode.toLowerCase()}`;
};

/**
 * Create tenant database
 */
const createTenantDatabase = async (tenantDbName) => {
  // Create temporary admin connection to postgres database to run CREATE DATABASE command
  const dbUser = process.env.DB_USER || process.env.PGUSER;
  const dbPass = process.env.DB_PASSWORD || process.env.DB_PASS || process.env.PGPASSWORD;
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = process.env.DB_PORT || 5432;

  const adminSequelize = new Sequelize('postgres', dbUser, dbPass, {
    host: dbHost,
    port: Number(dbPort),
    dialect: 'postgres',
    logging: false
  });

  try {
    // Create the database
    await adminSequelize.query(`CREATE DATABASE "${tenantDbName}"`);
    console.log(`✅ Database "${tenantDbName}" created successfully`);
  } catch (err) {
    // Ignore 'database already exists' (Postgres code 42P04). Re-throw others.
    const code = err && err.original && err.original.code;
    if (code === '42P04') {
      console.log(`⚠️  Database "${tenantDbName}" already exists`);
      return;
    }
    throw err;
  } finally {
    // Close admin connection
    await adminSequelize.close();
  }
};

/**
 * Get or create Sequelize instance for tenant DB with validation
 */
const getTenantSequelize = (tenantDbName) => {
  if (tenantConnections[tenantDbName]) {
    return tenantConnections[tenantDbName];
  }

  // Get DB credentials from env variables (similar to masterDb)
  const dbUser = process.env.DB_USER || process.env.PGUSER;
  const dbPass = process.env.DB_PASSWORD || process.env.DB_PASS || process.env.PGPASSWORD;
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = process.env.DB_PORT || 5432;

  if (!dbUser) {
    throw new Error('DB_USER environment variable is not set');
  }

  const sequelize = new Sequelize(
    tenantDbName,
    dbUser,
    dbPass,
    {
      host: dbHost,
      port: Number(dbPort),
      dialect: 'postgres',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );

  tenantConnections[tenantDbName] = sequelize;
  return sequelize;
};

/**
 * Verify that a tenant database connection is valid
 */
const verifyTenantConnection = async (tenantDbName) => {
  try {
    const sequelize = getTenantSequelize(tenantDbName);
    await sequelize.authenticate();
    console.log(`✅ Connected to tenant database "${tenantDbName}"`);
    return true;
  } catch (err) {
    console.error(`❌ Failed to connect to tenant database "${tenantDbName}":`, err.message);
    // Remove from cache if connection fails
    delete tenantConnections[tenantDbName];
    throw err;
  }
};

/**
 * Create base tables inside tenant DB by registering tenant models on the
 * tenant Sequelize instance and syncing. This ensures table definitions match
 * the model files in `src/model/tenant` (students, teachers, classes, users).
 */
const createTenantTables = async (tenantDbName) => {
  const sequelize = getTenantSequelize(tenantDbName);

  // Load tenant model definitions and register them on the tenant Sequelize
  // instance. Models export a function (sequelize, DataTypes) => model.
  const studentDef = require('../model/tenant/Student');
  const teacherDef = require('../model/tenant/Teacher');
  const classDef = require('../model/tenant/Class');

  // Optional tenant User model if present
  let userDef;
  try {
    userDef = require('../model/tenant/User');
  } catch (e) {
    userDef = null;
  }

  // Define models on tenant sequelize
  studentDef(sequelize, Sequelize.DataTypes);
  teacherDef(sequelize, Sequelize.DataTypes);
  classDef(sequelize, Sequelize.DataTypes);
  if (userDef) userDef(sequelize, Sequelize.DataTypes);

  // Sync models to create tables. Use safe sync (no force) so existing data is preserved.
  // This runs migrations/creates tables based on model definitions
  await sequelize.sync({ force: false });
  console.log(`✅ Tables created/synced for tenant database "${tenantDbName}"`);
};

/**
 * Clear tenant database cache
 */
const clearTenantCache = () => {
  Object.keys(tenantConnections).forEach(key => {
    delete tenantConnections[key];
  });
  console.log('✅ Tenant connection cache cleared');
};

module.exports = {
  generateTenantDbName,
  createTenantDatabase,
  getTenantSequelize,
  createTenantTables,
  verifyTenantConnection,
  clearTenantCache
};
