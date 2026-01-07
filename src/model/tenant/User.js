module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },

      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      
      phone: {
        type: DataTypes.STRING,
        allowNull: false
      },

      role: {
        type: DataTypes.ENUM('ADMIN', 'TEACHER', 'STAFF'),
        allowNull: false
      }
    },
    {
      freezeTableName: true,
      timestamps: true
    }
  );
};
