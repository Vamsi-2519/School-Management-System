<<<<<<< HEAD
const { Sequelize } = require('sequelize');

const createTenantDatabase = async (dbName) => {
  const sequelize = new Sequelize(
    process.env.MASTER_DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
=======
// const { Sequelize } = require('sequelize');
// const Organization = require('../model/master/organization');

// const tenantConnections = {};

// exports.generateTenantDbName = async () => {
//   const count = await Organization.count();
//   return `t${count + 1}`;
// };

// exports.createTenantDatabase = async (tenantDb) => {
//   const sequelize = new Sequelize(
//     'postgres',
//     process.env.DB_USER,
//     process.env.DB_PASSWORD,
//     {
//       host: process.env.DB_HOST,
//       dialect: 'postgres',
//       logging: false
//     }
//   );

//   await sequelize.query(`CREATE DATABASE "${tenantDb}"`);
//   await sequelize.close();
// };

// exports.getTenantSequelize = (tenantDb) => {
//   if (tenantConnections[tenantDb]) return tenantConnections[tenantDb];

//   const sequelize = new Sequelize(
//     tenantDb,
//     process.env.DB_USER,
//     process.env.DB_PASSWORD,
//     {
//       host: process.env.DB_HOST,
//       dialect: 'postgres',
//       logging: false
//     }
//   );

//   tenantConnections[tenantDb] = sequelize;
//   return sequelize;
// };





const { Sequelize, DataTypes } = require('sequelize');
const Organization = require('../model/master/organization');

// Store tenant connections
const tenantConnections = {};

exports.generateTenantDbName = async () => {
  const count = await Organization.count();
  return `tenant_${count + 1}`;
};

// Create a new tenant DB dynamically
exports.createTenantDatabase = async (tenantDb) => {
  // Connect to default DB to create new DB
  const sequelize = new Sequelize(
    'postgres', 
    process.env.DB_USER, 
    process.env.DB_PASSWORD, 
    {
      host: process.env.DB_HOST,
>>>>>>> 86eb9e9 (Initial commit)
      dialect: 'postgres',
      logging: false
    }
  );

<<<<<<< HEAD
  await sequelize.query(`CREATE DATABASE ${dbName}`);
};

const createTenantTables = async (dbName) => {
  const tenantSequelize = new Sequelize(
    dbName,
=======
  // Create tenant database
  await sequelize.query(`CREATE DATABASE "${tenantDb}"`);
  await sequelize.close();
};

// Return a Sequelize instance connected to the tenant DB
exports.getTenantSequelize = (tenantDb) => {
  if (tenantConnections[tenantDb]) return tenantConnections[tenantDb];

  const sequelize = new Sequelize(
    tenantDb,
>>>>>>> 86eb9e9 (Initial commit)
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
<<<<<<< HEAD
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
=======
      dialect: 'postgres',
      logging: false,
    }
  );

  // Create tenant tables example (customize per your schema)
  const Student = sequelize.define('Student', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    grade: { type: DataTypes.STRING }
  }, { tableName: 'students', timestamps: true });

  tenantConnections[tenantDb] = sequelize;
  return sequelize;
>>>>>>> 86eb9e9 (Initial commit)
};
