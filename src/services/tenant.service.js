const { Sequelize } = require('sequelize');

const createTenantDatabase = async (dbName) => {
  const sequelize = new Sequelize(
    process.env.MASTER_DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'postgres',
      logging: false
    }
  );

  await sequelize.query(`CREATE DATABASE ${dbName}`);
};

const createTenantTables = async (dbName) => {
  const tenantSequelize = new Sequelize(
    dbName,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'postgres',
      logging: false
    }
  );

  // Example base table
  await tenantSequelize.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100) UNIQUE
    )
  `);
};

module.exports = {
  createTenantDatabase,
  createTenantTables
};
