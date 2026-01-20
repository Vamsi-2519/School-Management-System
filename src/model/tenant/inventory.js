// src/models/tenant/inventory.model.js
module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');

  const Inventory = sequelize.define(
    'Inventory',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },

      itemName: {
        type: DataTypes.STRING,
        allowNull: false
      },

      itemCode: {
        type: DataTypes.STRING,
        unique: true
      },

      categoryId: {
        type: DataTypes.UUID,
        allowNull: false
      },

      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },

      unit: {
        type: DataTypes.STRING, // pcs, kg, box
        defaultValue: 'pcs'
      },

      purchasePrice: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
      },
      purchaseDate: {
        type: DataTypes.DATE
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      organizationId: {
        type: DataTypes.UUID,
        allowNull: true
      },
      Schoolcode: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      tableName: 'inventories',
      timestamps: true
    }
  );

  return Inventory;
};
