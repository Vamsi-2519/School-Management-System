module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Student', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    admissionNo: {
      type: DataTypes.STRING,
      unique: true,
    },
    gender: DataTypes.STRING,
    dob: DataTypes.DATEONLY,
    profileImage: {
      type: String,
      required: true,
      unique: true,
    },
    organizationId: {
        type: DataTypes.UUID,
        allowNull: true, // For schooladmin & marketing users
      },
  }, {
    tableName: 'students',
    timestamps: true,
  });
};
