const { DataTypes } = require('sequelize');
const masterSequelize = require('../../config/masterDb');

const MasterUser = masterSequelize.define(
  'MasterUser',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('superadmin', 'marketing', 'schooladmin'),
      allowNull: false,
    },
    schoolCode: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    organizationId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'master_users',
    timestamps: true,
    underscored: true,
  }
);

module.exports = MasterUser;
