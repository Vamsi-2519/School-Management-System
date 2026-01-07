// const { Sequelize } = require('sequelize');
// require('dotenv').config();

// const get = (key, fallback) => {
//   const val = process.env[key] ?? (fallback ? process.env[fallback] : undefined);
//   return typeof val === 'string' ? val.trim() : val;
// };

// const DB_NAME = get('DB_NAME', 'MASTER_DB_NAME');
// const DB_USER = get('DB_USER');
// const DB_PASS = get('DB_PASS');
// const DB_HOST = get('DB_HOST') || 'localhost';
// const DB_PORT = get('DB_PORT') || 5432;

// if (!DB_NAME || !DB_USER) {
//   console.warn('masterDb: missing DB_NAME or DB_USER environment variables');
// }

// const masterSequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
//   host: DB_HOST,
//   port: DB_PORT,
//   dialect: 'postgres',
//   logging: false,
// });

// module.exports = masterSequelize;



// Sequelize master DB connection
const { Sequelize } = require('sequelize');
const env = require('./env');

const masterDbUrl = env.masterDbUrl;

let sequelize;
if (typeof masterDbUrl === 'string' && masterDbUrl.trim()) {
  sequelize = new Sequelize(masterDbUrl, { logging: false });
} else {
  const DB_NAME = process.env.DB_NAME || process.env.MASTER_DB_NAME || 'postgres';
  const DB_USER = process.env.DB_USER || process.env.PGUSER || '';
  const DB_PASS = process.env.DB_PASSWORD || process.env.DB_PASS || process.env.PGPASSWORD || '';
  const DB_HOST = process.env.DB_HOST || 'localhost';
  const DB_PORT = process.env.DB_PORT || 5432;

  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: Number(DB_PORT),
    dialect: 'postgres',
    logging: false,
  });
}

module.exports = sequelize;
