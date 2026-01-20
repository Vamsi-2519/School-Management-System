const { getTenantConnection } = require('../../config/tenantManager');
const initTenantModels = require('../../model/tenant');

exports.createInventory = async (req, res) => {
  try {
    const {
      itemName,
      itemCode,
      categoryId,
      quantity,
      unit,
      purchasePrice,
      purchaseDate,
      vendorName,
      invoiceNumber,
      remarks
    } = req.body;

    /* ---------------- REQUIRED FIELDS CHECK ---------------- */
    const requiredFields = [
      'itemName',
      'itemCode',
      'categoryId',
      'quantity'
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          message: `${field} is required`
        });
      }
    }

    /* ---------------- BUSINESS VALIDATIONS ---------------- */
    if (quantity < 0) {
      return res.status(400).json({
        message: 'Quantity cannot be negative'
      });
    }

    if (purchasePrice && purchasePrice < 0) {
      return res.status(400).json({
        message: 'Purchase price cannot be negative'
      });
    }

    /* ---------------- TENANT DB CONNECTION ---------------- */
    const { dbName } = req.user; // from JWT
    const tenantDb = await getTenantConnection(dbName);
    const { Inventory } = initTenantModels(tenantDb);

    /* ---------------- DUPLICATE ITEM CODE CHECK ---------------- */
    const existingItem = await Inventory.findOne({
      where: { itemCode }
    });

    if (existingItem) {
      return res.status(400).json({
        message: 'Item with this itemCode already exists'
      });
    }

    /* ---------------- CREATE INVENTORY ---------------- */
    const newInventory = await Inventory.create({
      itemName,
      itemCode,
      categoryId,
      quantity,
      unit: unit || 'pcs',
      purchasePrice: purchasePrice || 0,
      purchaseDate,
      vendorName,
      invoiceNumber,
      remarks,
      isActive: true
    });

    /* ---------------- SUCCESS RESPONSE ---------------- */
    return res.status(201).json({
      message: 'Inventory item created successfully',
      inventory: newInventory
    });

  } catch (error) {
    console.error('Error creating inventory:', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};




/**
 * GET ALL INVENTORY ITEMS (with pagination & search)
 */
exports.getAllInventory = async (req, res) => {
  try {
    const { dbName } = req.user;
    const { search = '' } = req.query;

    const tenantDb = await getTenantConnection(dbName);
    const { Inventory, InventoryCategory } = initTenantModels(tenantDb);

    const data = await Inventory.findAndCountAll({
      where: search
        ? { itemName: { [tenantDb.Sequelize.Op.iLike]: `%${search}%` } }
        : {},
      include: [{ model: InventoryCategory, as: 'category' }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      total: data.count,
      data: data.rows
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * GET INVENTORY BY ID
 */
exports.getInventoryById = async (req, res) => {
  try {
    const { dbName } = req.user;
    const { id } = req.params;

    const tenantDb = await getTenantConnection(dbName);
    const { Inventory, InventoryCategory } = initTenantModels(tenantDb);

    const item = await Inventory.findByPk(id, {
      include: [{ model: InventoryCategory, as: 'category' }]
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * UPDATE INVENTORY
 */
exports.updateInventory = async (req, res) => {
  try {
    const { dbName } = req.user;
    const { id } = req.params;

    const tenantDb = await getTenantConnection(dbName);
    const { Inventory } = initTenantModels(tenantDb);

    const inventory = await Inventory.findByPk(id);
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    await inventory.update(req.body);

    return res.status(200).json({
      success: true,
      message: 'Inventory updated',
      data: inventory
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * DELETE INVENTORY (Soft Delete)
 */
exports.deleteInventory = async (req, res) => {
  try {
    const { dbName } = req.user;
    const { id } = req.params;

    const tenantDb = await getTenantConnection(dbName);
    const { Inventory } = initTenantModels(tenantDb);

    const inventory = await Inventory.findByPk(id);
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    await inventory.update({ isActive: false });

    return res.status(200).json({
      success: true,
      message: 'Inventory item deactivated'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
