// src/models/tenant/index.js
const Sequelize = require('sequelize');

const tenantDbs = {}; // multiple tenants can be cached here

const createTenantConnection = (dbName, dbUser, dbPass, dbHost) => {
  const sequelize = new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    dialect: 'postgres',
  });

  const db = {};
  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

//   // tenant models
// Import tenant models
  db.Student = require('./Student')(sequelize, Sequelize.DataTypes);
  db.Teacher = require('./Teacher')(sequelize, Sequelize.DataTypes);
  db.Class = require('./Class')(sequelize, Sequelize.DataTypes);
  db.Fee = require('./Fee')(sequelize, Sequelize.DataTypes);
  db.Parent = require('./Parent')(sequelize, Sequelize.DataTypes);
  db.Attendance = require('./Attendance')(sequelize, Sequelize.DataTypes);
  db.Homework = require('./Homework')(sequelize, Sequelize.DataTypes);
  db.Exam = require('./Exam')(sequelize, Sequelize.DataTypes);
  db.Marks = require('./Marks')(sequelize, Sequelize.DataTypes);
  db.Transport = require('./Transport')(sequelize, Sequelize.DataTypes);
  db.Inventory = require('./Inventory')(sequelize, Sequelize.DataTypes);
  db.Payroll = require('./Payroll')(sequelize, Sequelize.DataTypes);
  db.Holiday = require('./Holiday')(sequelize, Sequelize.DataTypes);
  db.Announcement = require('./Announcement')(sequelize, Sequelize.DataTypes);

  return db;
};

module.exports = { createTenantConnection, tenantDbs };


