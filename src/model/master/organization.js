const { DataTypes } = require('sequelize');
const masterSequelize = require('../../config/masterDb');

const Organization = masterSequelize.define(
  'Organization',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
<<<<<<< HEAD

=======
>>>>>>> 86eb9e9 (Initial commit)
    schoolName: {
      type: DataTypes.STRING,
      allowNull: false
    },
<<<<<<< HEAD

=======
>>>>>>> 86eb9e9 (Initial commit)
    schoolCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
<<<<<<< HEAD

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    address: {
      type: DataTypes.STRING,
      allowNull: false
    },

    logo: {
      type: DataTypes.STRING,
      allowNull: true
=======
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tenantDb: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
>>>>>>> 86eb9e9 (Initial commit)
    }
  },
  {
    tableName: 'organizations',
    timestamps: true
  }
);

module.exports = Organization;
