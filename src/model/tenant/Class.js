module.exports = (sequelize, DataTypes) => {
  console.log('Initializing Class model...');
  return sequelize.define(
    'Class',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      organizationId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      section: {
        type: DataTypes.ENUM('A', 'B', 'C', 'D'),
        allowNull: true,
        defaultValue: null
      },
      ClassTeacherName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      academicYear: {
        type: DataTypes.STRING,
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
      Schoolcode: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      tableName: 'classes',
      timestamps: true
    }
  );
};
