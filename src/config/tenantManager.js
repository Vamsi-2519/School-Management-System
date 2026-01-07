const { Sequelize } = require('sequelize');

const tenantConnections = {};

const getTenantDb = (dbName) => {
  if (!tenantConnections[dbName]) {
    tenantConnections[dbName] = new Sequelize(
      dbName,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false
      }
    );
  }
  return tenantConnections[dbName];
};

module.exports = { getTenantDb };
