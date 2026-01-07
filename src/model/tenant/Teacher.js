module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Teacher',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
      },
      gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
        allowNull: false,
        defaultValue: 'Other'
      },
      joiningDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      subjectName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },
      organizationId: {
        type: DataTypes.UUID,
        allowNull: true
      }
    },
    {
      tableName: 'teachers',
      timestamps: true
    }
  );
};
