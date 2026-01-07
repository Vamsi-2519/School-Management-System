const { Sequelize } = require('sequelize');
require('dotenv').config();

const get = (key, fallback) => {
  const val = process.env[key] ?? (fallback ? process.env[fallback] : undefined);
  return typeof val === 'string' ? val.trim() : val;
};

const DB_NAME = get('DB_NAME', 'MASTER_DB_NAME');
const DB_USER = get('DB_USER');
const DB_PASS = get('DB_PASS');
const DB_HOST = get('DB_HOST') || 'localhost';
const DB_PORT = get('DB_PORT') || 5432;

if (!DB_NAME || !DB_USER) {
  console.warn('masterDb: missing DB_NAME or DB_USER environment variables');
}

const masterSequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: false,
});

module.exports = masterSequelize;
