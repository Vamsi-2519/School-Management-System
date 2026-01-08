module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Student', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    admissionNo: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false
    },
    organizationId: {
      type: DataTypes.UUID,
      allowNull: true
    }
  }, {
    tableName: 'students',
    timestamps: true,
  });
};
