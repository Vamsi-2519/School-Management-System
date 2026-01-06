const { Sequelize } = require('sequelize');

const tenantConnections = {};

exports.getTenantDb = async (dbName) => {
  if (tenantConnections[dbName]) {
    return tenantConnections[dbName];
  }

  const sequelize = new Sequelize(
    dbName,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      dialect: 'postgres',
      logging: false
    }
  );

  tenantConnections[dbName] = sequelize;
  return sequelize;
};
