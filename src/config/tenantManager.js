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
  if (tenantConnections.has(key)) {
    try {
      const cached = tenantConnections.get(key);
      await cached.authenticate();
      return cached;
    } catch (err) {
      console.warn(`⚠️  Cached connection for "${key}" is invalid, removing from cache:`, err.message);
      tenantConnections.delete(key);
    }
  }

  try {
    const sequelize = new Sequelize(tenantConfig.url, { 
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
    
    // Authenticate before caching
    await sequelize.authenticate();
    console.log(`✅ Connected to tenant database: ${key}`);
    
    tenantConnections.set(key, sequelize);
    return sequelize;
  } catch (err) {
    console.error(`❌ Failed to connect to tenant database "${key}":`, err.message);
    throw new Error(`Cannot connect to tenant database "${key}". Database may not exist or credentials are invalid.`);
  }
}

/**
 * Clear all cached connections
 */
function clearTenantConnections() {
  tenantConnections.forEach((sequelize, key) => {
    sequelize.close().catch(err => console.error(`Error closing connection for ${key}:`, err.message));
  });
  tenantConnections.clear();
  console.log('✅ Cleared all tenant connections');
}

module.exports = { getTenantConnection, tenantConnections, clearTenantConnections };
