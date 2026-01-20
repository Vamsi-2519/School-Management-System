// // src/models/index.js
// const Sequelize = require('sequelize');

// const sequelize = new Sequelize(
//   process.env.MASTER_DB,
//   process.env.DB_USER,
//   process.env.DB_PASS,
//   {
//     host: process.env.DB_HOST,
//     dialect: 'postgres',
//     logging: false
//   }
// );

// const db = {};

// db.Sequelize = Sequelize;
// db.sequelize = sequelize;

// // Load Master Models
// db.Organization = require('../master/organization')(sequelize, Sequelize.DataTypes);

// // Ensure the organizations table exists in the master DB (development only)
// db.Organization.sync();

// module.exports = db;




const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/masterDb'); // your master DB connection

const Organization = require('./organization')(sequelize, DataTypes);
// add other master models similarly

module.exports = {
  Organization,
  sequelize
};
