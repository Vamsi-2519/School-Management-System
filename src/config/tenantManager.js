const { Sequelize } = require('sequelize');

const tenantConnections = {};

<<<<<<< HEAD
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
=======
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
>>>>>>> 86eb9e9 (Initial commit)
