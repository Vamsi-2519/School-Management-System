const { Sequelize } = require('sequelize');
const Organization = require('../model/master/organization');

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
  // Connect to default postgres database
  const sequelize = new Sequelize(
    'postgres',
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false
    }
  );

  // Create DB if not exists
  await sequelize.query(`CREATE DATABASE "${tenantDbName}"`);
  await sequelize.close();
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
 * Create base tables inside tenant DB
 */
const createTenantTables = async (tenantDbName) => {
  const sequelize = getTenantSequelize(tenantDbName);

  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255),
      role VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

module.exports = {
  generateTenantDbName,
  createTenantDatabase,
  getTenantSequelize,
  createTenantTables
};
