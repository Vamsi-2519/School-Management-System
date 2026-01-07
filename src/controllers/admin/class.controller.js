const { Sequelize } = require('sequelize');
const { getTenantSequelize } = require('../../services/tenant.service');
const Organization = require('../../model/master/organization');

async function resolveTenantDbName({ tenantDbName, organizationId }) {
  if (tenantDbName) return tenantDbName;
  if (!organizationId) throw new Error('tenantDbName or organizationId is required');
  const org = await Organization.findByPk(organizationId);
  if (!org) throw new Error('Organization not found or has no tenantDb');
  if (!org.tenantDb) throw new Error('Organization has no tenantDb configured');
  return org.tenantDb;
}

function getClassModel(tenantSequelize) {
  return require('../../model/tenant/Class')(tenantSequelize, Sequelize.DataTypes);
}

exports.createClass = async (req, res) => {
  try {
    const { tenantDbName, organizationId, name, section, ClassTeacherName, academicYear, stream, maxStrength, currentStrength } = req.body;
    if (!name || !ClassTeacherName || !academicYear) return res.status(400).json({ success: false, message: 'name, ClassTeacherName and academicYear are required' });

    const dbName = await resolveTenantDbName({ tenantDbName, organizationId });
    const tenantSequelize = getTenantSequelize(dbName);
    const Class = getClassModel(tenantSequelize);

    const classData = await Class.create({ organizationId, name, section, ClassTeacherName, academicYear, stream, maxStrength, currentStrength });
    return res.status(201).json({ success: true, message: 'Class created successfully', data: classData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Create failed', error: error.message });
  }
};

exports.getAllClasses = async (req, res) => {
  try {
    const { tenantDbName, organizationId, page = 1, limit = 25 } = req.query;
    const dbName = await resolveTenantDbName({ tenantDbName, organizationId });
    const tenantSequelize = getTenantSequelize(dbName);
    const Class = getClassModel(tenantSequelize);

    const where = organizationId ? { organizationId } : {};
    const offset = (Number(page) - 1) * Number(limit);

    const { rows, count } = await Class.findAndCountAll({ where, order: [['createdAt', 'DESC']], limit: Number(limit), offset });
    return res.json({ success: true, total: count, data: rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.getClassById = async (req, res) => {
  try {
    const { tenantDbName, organizationId } = req.query;
    const dbName = await resolveTenantDbName({ tenantDbName, organizationId });
    const tenantSequelize = getTenantSequelize(dbName);
    const Class = getClassModel(tenantSequelize);

    const classData = await Class.findByPk(req.params.id);
    if (!classData) return res.status(404).json({ success: false, message: 'Class not found' });
    return res.json({ success: true, data: classData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const { tenantDbName, organizationId } = req.body;
    const dbName = await resolveTenantDbName({ tenantDbName, organizationId });
    const tenantSequelize = getTenantSequelize(dbName);
    const Class = getClassModel(tenantSequelize);

    const classData = await Class.findByPk(req.params.id);
    if (!classData) return res.status(404).json({ success: false, message: 'Class not found' });

    await classData.update(req.body);
    return res.json({ success: true, message: 'Class updated successfully', data: classData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const { tenantDbName, organizationId } = req.query;
    const dbName = await resolveTenantDbName({ tenantDbName, organizationId });
    const tenantSequelize = getTenantSequelize(dbName);
    const Class = getClassModel(tenantSequelize);

    const classData = await Class.findByPk(req.params.id);
    if (!classData) return res.status(404).json({ success: false, message: 'Class not found' });

    await classData.destroy();
    return res.json({ success: true, message: 'Class deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
