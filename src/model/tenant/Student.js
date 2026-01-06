module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define(
    'Student',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
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
        allowNull: false,
        unique: true
      },

      gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
        allowNull: false
      },

      dob: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },

      parentName: {
        type: DataTypes.STRING,
        allowNull: false
      },

      parentPhone: {
        type: DataTypes.STRING,
        allowNull: false
      },

      parentEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },

      classId: {
        type: DataTypes.UUID,
        allowNull: true
      },

      sectionId: {
        type: DataTypes.UUID,
        allowNull: false
      },

      address: {
        type: DataTypes.TEXT,
        allowNull: false
      },

      profileImage: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
   
    {
      tableName: 'students',
      timestamps: true,
      underscored: true
    }
  );

  return Student;
};
