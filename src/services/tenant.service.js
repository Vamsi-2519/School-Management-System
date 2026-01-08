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
  // Use the master DB connection to create tenant databases. This centralizes
  // configuration and avoids creating a new Sequelize instance with possibly
  // inconsistent env vars.
  try {
    await masterSequelize.query(`CREATE DATABASE "${tenantDbName}"`);
  } catch (err) {
    // Ignore 'database already exists' (Postgres code 42P04). Re-throw others.
    const code = err && err.original && err.original.code;
    if (code === '42P04') {
      return;
    }
    throw err;
  }
};

/**
 * Get or create Sequelize instance for tenant DB
 */
const getTenantSequelize = (tenantDbName) => {
  if (tenantConnections[tenantDbName]) {
    return tenantConnections[tenantDbName];
  }

  const sequelize = new Sequelize(
    tenantDbName,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false
    }
  );

  tenantConnections[tenantDbName] = sequelize;
  return sequelize;
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
  await sequelize.sync();
};

module.exports = {
  generateTenantDbName,
  createTenantDatabase,
  getTenantSequelize,
  createTenantTables
};
