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
      dialect: 'postgres',
      logging: false
    }
  );

  // Create tenant database
  await sequelize.query(`CREATE DATABASE "${tenantDb}"`);
  await sequelize.close();
};

// Return a Sequelize instance connected to the tenant DB
exports.getTenantSequelize = (tenantDb) => {
  if (tenantConnections[tenantDb]) return tenantConnections[tenantDb];

  const sequelize = new Sequelize(
    tenantDb,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
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
};
