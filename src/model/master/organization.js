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

    schoolName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    schoolCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

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
    }
  },
  {
    tableName: 'organizations',
    timestamps: true
  }
);

module.exports = Organization;
