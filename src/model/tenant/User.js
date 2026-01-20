const { Organization } = require("../master");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      OrganizationId: {
        type: DataTypes.UUID,
        allowNull: false,
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
    },
    {
      freezeTableName: true,
      timestamps: true
    }
  );
};
