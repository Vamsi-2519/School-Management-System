// src/models/index.js
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.MASTER_DB,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Load Master Models
db.Organization = require('./master/organization')(sequelize, Sequelize.DataTypes);

module.exports = db;
