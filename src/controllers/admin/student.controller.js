const { sequelize } = require('../../config/tenantManager'); // or wherever you init tenant DB
const Student = require('../../model/tenant/Student')(sequelize, require('sequelize').DataTypes);


exports.createStudent = async (req, res) => {
  try {
    const body = req.body || {};  // fallback if undefined

    const {
      firstName,
      lastName,
      admissionNo,
      gender,
      dob,
      parentName,
      parentPhone,
      parentEmail,
      classId,
      sectionId,
      address,
      profileImage
    } = body;

    // Required field validation
    if (!firstName || !admissionNo || !gender || !dob || !parentName || !parentPhone || !parentEmail || !sectionId || !address) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' });
    }

    
    const student = await Student.create({
      firstName,
      lastName,
      admissionNo,
      gender,
      dob,
      parentName,
      parentPhone,
      parentEmail,
      classId,
      sectionId,
      address,
      profileImage
    });

    res.json({ success: true, message: 'Student created', student });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Student creation failed', error: err.message });
  }
};






// Get all students for a school
exports.getStudents = async (req, res) => {
  try {
    const { schoolCode } = req.query;

    if (!schoolCode) return res.status(400).json({ success: false, message: 'schoolCode is required' });

    const org = await Organization.findOne({ where: { schoolCode } });
    if (!org) return res.status(404).json({ success: false, message: 'School not found' });

    const db = tenantDbs[org.tenantDb];
    if (!db) return res.status(404).json({ success: false, message: 'Tenant DB not found' });

    const students = await db.Student.findAll();
    return res.json({ success: true, students });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Failed to fetch students', error: err.message });
  }
};




/**
 * Get all students
 */
exports.getAllStudents = async (req, res) => {
  try {
    const students = await StudentModel.findAll();
    return res.json({
      success: true,
      data: students
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
      error: err.message
    });
  }
};

/**
 * Get student by ID
 */
exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await StudentModel.findByPk(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    return res.json({
      success: true,
      data: student
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch student',
      error: err.message
    });
  }
};

/**
 * Update student
 */
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const student = await StudentModel.findByPk(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    await student.update(updates);

    return res.json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update student',
      error: err.message
    });
  }
};

/**
 * Delete student
 */
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await StudentModel.findByPk(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    await student.destroy();

    return res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete student',
      error: err.message
    });
  }
};
