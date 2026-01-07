const masterDb = require('../../config/masterDb');
const { Sequelize } = require('sequelize');
const OrganizationModel = require('../../model/master/organization');
const { getTenantDb } = require('../../config/tenantManager');

const Organization = OrganizationModel(masterDb, Sequelize.DataTypes);

exports.createStudent = async (req, res) => {
  try {
    const { schoolCode, firstName, admissionNo, gender } = req.body;

    const org = await Organization.findOne({ where: { schoolCode } });
    if (!org) return res.status(404).json({ message: 'School not found' });

    const tenantDb = await getTenantDb(org.tenantDb);

    const student = await tenantDb.Student.create({
      firstName,
      admissionNo,
      gender,
      dob: req.body.dob,
      lastName: req.body.lastName,
      profileImage: req.body.profileImage

    });

    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
