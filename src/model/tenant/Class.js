const { ENUM } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define('Class', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    organizationId: {
        type: DataTypes.UUID,
        allowNull: true, // For schooladmin & marketing users
        // 
   },
    name: {
      type: DataTypes.STRING,
      required: true,
    },
    section: {
      type: DataTypes.STRING,
      ENUM: ['A', 'B', 'C', 'D'],
      default: ' '
    },
    ClassTeacherName: {
      type: DataTypes.STRING,
      required: true,
    },
    academicYear: {
      type: DataTypes.STRING, // 2024-2025
      allowNull: false
    },
    stream: {
      type: DataTypes.ENUM('State', 'CBSE', 'ICSE', 'IB'),
      allowNull: true
    },
     maxStrength: {
      type: DataTypes.INTEGER,
      defaultValue: 40
    },
    currentStrength: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
  }, {
    tableName: 'classes',
    timestamps: true,
  });

  return Class;
};
