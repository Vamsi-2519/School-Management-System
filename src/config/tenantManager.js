// const { Sequelize } = require('sequelize');

// const tenantConnections = {};

// const getTenantDb = async (dbName) => {
//   if (tenantConnections[dbName]) return tenantConnections[dbName];

//   const sequelize = new Sequelize(
//     dbName,
//     process.env.DB_USER,
//     process.env.DB_PASSWORD,
//     {
//       host: process.env.DB_HOST,
//       dialect: 'postgres',
//       logging: false,
//     }
//   );

//   const db = {};
//   db.sequelize = sequelize;

//   db.Student = require('../model/tenant/Student')(sequelize, Sequelize.DataTypes);
//   db.User = require('../model/tenant/User')(sequelize, Sequelize.DataTypes);

//   await sequelize.sync();

//   tenantConnections[dbName] = db;
//   return db;
// };

// module.exports = { getTenantDb };




// Manages tenant DB connections cache
const { Sequelize } = require('sequelize');
const tenantConnections = new Map();

async function getTenantConnection(tenantConfig) {
  const key = tenantConfig.database; 
  if (tenantConnections.has(key)) return tenantConnections.get(key);
  const sequelize = new Sequelize(tenantConfig.url, { logging: false });
  // Optionally authenticate
  await sequelize.authenticate();
  tenantConnections.set(key, sequelize);
  return sequelize;
}

module.exports = { getTenantConnection, tenantConnections };
