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

function getTeacherModel(tenantSequelize) {
  return require('../../model/tenant/Teacher')(tenantSequelize, Sequelize.DataTypes);
}

exports.createTeacher = async (req, res) => {
  try {
    const { tenantDbName, organizationId, firstName, lastName, gender, joiningDate, phone, email, subjectName, salary, profileImage } = req.body;
    if (!firstName || !phone || !email || !joiningDate) return res.status(400).json({ success: false, error: 'firstName, phone, email and joiningDate are required' });

    const dbName = await resolveTenantDbName({ tenantDbName, organizationId });
    const tenantSequelize = getTenantSequelize(dbName);
    const Teacher = getTeacherModel(tenantSequelize);

    const teacher = await Teacher.create({ firstName, lastName, gender, joiningDate, phone, email, subjectName, salary, profileImage, organizationId });
    return res.status(201).json({ success: true, data: teacher });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAllTeachers = async (req, res) => {
  try {
    const { tenantDbName, organizationId, page = 1, limit = 25 } = req.query;
    const dbName = await resolveTenantDbName({ tenantDbName, organizationId });
    const tenantSequelize = getTenantSequelize(dbName);
    const Teacher = getTeacherModel(tenantSequelize);

    const offset = (Number(page) - 1) * Number(limit);
    const { rows, count } = await Teacher.findAndCountAll({ where: organizationId ? { organizationId } : {}, limit: Number(limit), offset });
    return res.json({ success: true, total: count, data: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getTeacherById = async (req, res) => {
  try {
    const { tenantDbName, organizationId } = req.query;
    const dbName = await resolveTenantDbName({ tenantDbName, organizationId });
    const tenantSequelize = getTenantSequelize(dbName);
    const Teacher = getTeacherModel(tenantSequelize);

    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) return res.status(404).json({ success: false, error: 'Teacher not found' });
    return res.json({ success: true, data: teacher });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const { tenantDbName, organizationId } = req.body;
    const dbName = await resolveTenantDbName({ tenantDbName, organizationId });
    const tenantSequelize = getTenantSequelize(dbName);
    const Teacher = getTeacherModel(tenantSequelize);

    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) return res.status(404).json({ success: false, error: 'Teacher not found' });

    await teacher.update(req.body);
    return res.json({ success: true, data: teacher });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const { tenantDbName, organizationId } = req.query;
    const dbName = await resolveTenantDbName({ tenantDbName, organizationId });
    const tenantSequelize = getTenantSequelize(dbName);
    const Teacher = getTeacherModel(tenantSequelize);

    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) return res.status(404).json({ success: false, error: 'Teacher not found' });

    await teacher.destroy();
    return res.json({ success: true, message: 'Teacher deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
