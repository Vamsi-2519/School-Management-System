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

function getStudentModel(tenantSequelize) {
  return require('../../model/tenant/Student')(tenantSequelize, Sequelize.DataTypes);
}

exports.createStudent = async (req, res) => {
  try {
    const { tenantDbName, organizationId, firstName, lastName, admissionNo, gender, dob, profileImage } = req.body;
    if (!firstName || !admissionNo) return res.status(400).json({ success: false, error: 'firstName and admissionNo required' });

    const dbName = await resolveTenantDbName({ tenantDbName, organizationId });
    const tenantSequelize = getTenantSequelize(dbName);
    const Student = getStudentModel(tenantSequelize);

    const student = await Student.create({ firstName, lastName, admissionNo, gender, dob, profileImage, organizationId });
    return res.status(201).json({ success: true, data: student });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const { tenantDbName, organizationId, page = 1, limit = 25 } = req.query;
    const dbName = await resolveTenantDbName({ tenantDbName, organizationId });
    const tenantSequelize = getTenantSequelize(dbName);
    const Student = getStudentModel(tenantSequelize);

    const offset = (Number(page) - 1) * Number(limit);
    const { rows, count } = await Student.findAndCountAll({ where: organizationId ? { organizationId } : {}, limit: Number(limit), offset });
    return res.json({ success: true, total: count, data: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const { tenantDbName, organizationId } = req.query;
    const dbName = await resolveTenantDbName({ tenantDbName, organizationId });
    const tenantSequelize = getTenantSequelize(dbName);
    const Student = getStudentModel(tenantSequelize);

    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ success: false, error: 'Student not found' });
    return res.json({ success: true, data: student });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { tenantDbName, organizationId } = req.body;
    const dbName = await resolveTenantDbName({ tenantDbName, organizationId });
    const tenantSequelize = getTenantSequelize(dbName);
    const Student = getStudentModel(tenantSequelize);

    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ success: false, error: 'Student not found' });

    await student.update(req.body);
    return res.json({ success: true, data: student });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { tenantDbName, organizationId } = req.query;
    const dbName = await resolveTenantDbName({ tenantDbName, organizationId });
    const tenantSequelize = getTenantSequelize(dbName);
    const Student = getStudentModel(tenantSequelize);

    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ success: false, error: 'Student not found' });

    await student.destroy();
    return res.json({ success: true, message: 'Student deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};


// const masterDb = require('../../config/masterDb');
// const { Sequelize } = require('sequelize');
// const OrganizationModel = require('../../model/master/organization');
// const { getTenantDb } = require('../../config/tenantManager');

// const Organization = OrganizationModel(masterDb, Sequelize.DataTypes);

// exports.createStudent = async (req, res) => {
//   try {
//     const { schoolCode, firstName, admissionNo, gender } = req.body;

//     const org = await Organization.findOne({ where: { schoolCode } });
//     if (!org) return res.status(404).json({ message: 'School not found' });

//     const tenantDb = await getTenantDb(org.tenantDb);

//     const student = await tenantDb.Student.create({
//       firstName,
//       admissionNo,
//       gender,
//       dob: req.body.dob,
//       lastName: req.body.lastName,
//       profileImage: req.body.profileImage

//     });

//     res.json({ success: true, student });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
