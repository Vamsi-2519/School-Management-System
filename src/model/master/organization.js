const { DataTypes } = require('sequelize');
const masterSequelize = require('../../config/masterDb');

const Organization = masterSequelize.define(
  'Organization',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tenantDb: {
      type: DataTypes.STRING,
      // allow NULL for existing records so ALTER TABLE can succeed during dev sync
      // new organizations created by onboarding will populate this field.
      allowNull: true,
      unique: true
    }
  },
  {
    tableName: 'organizations',
    timestamps: true
  }
);

module.exports = Organization;
