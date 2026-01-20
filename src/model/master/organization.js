module.exports = (sequelize, DataTypes) => {
  const Organization = sequelize.define(
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
        allowNull: true,
        unique: true
      }
    },
    {
      tableName: 'organizations',
      timestamps: true
    }
  );
  return Organization;
};
