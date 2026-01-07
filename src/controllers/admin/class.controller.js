const  Class  = require('../src/model/tenant/class');

/**
 * CREATE CLASS
 */
exports.createClass = async (req, res) => {
  try {
    const {
      organizationId,
      name,
      section,
      ClassTeacherName,
      academicYear,
      stream,
      maxStrength,
      currentStrength
    } = req.body;

    // Basic validation
    if (!name || !ClassTeacherName || !academicYear) {
      return res.status(400).json({
        success: false,
        message: 'name, ClassTeacherName and academicYear are required'
      });
    }

    const classData = await Class.create({
      organizationId,
      name,
      section,
      ClassTeacherName,
      academicYear,
      stream,
      maxStrength,
      currentStrength
    });

    return res.status(201).json({
      success: true,
      message: 'Class created successfully',
      data: classData
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Create failed',
      error: error.message
    });
  }
};

/**
 * GET ALL CLASSES
 * Supports:
 *  - organizationId filter
 *  - pagination
 */
exports.getAllClasses = async (req, res) => {
  try {
    const { organizationId, } = req.query;

    const where = organizationId ? { organizationId } : {};

    // const offset = (page - 1) * limit;

    const { rows, count } = await Class.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset: Number(offset)
    });

    return res.json({
      success: true,
      total: count,
      data: rows
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * GET CLASS BY ID
 */
exports.getClassById = async (req, res) => {
  try {
    const classData = await Class.findByPk(req.params.id);

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    return res.json({
      success: true,
      data: classData
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * UPDATE CLASS
 */
exports.updateClass = async (req, res) => {
  try {
    const classData = await Class.findByPk(req.params.id);

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    const {
      organizationId,
      name,
      section,
      ClassTeacherName,
      academicYear,
      stream,
      maxStrength,
      currentStrength
    } = req.body;

    await classData.update({
      organizationId,
      name,
      section,
      ClassTeacherName,
      academicYear,
      stream,
      maxStrength,
      currentStrength
    });

    return res.json({
      success: true,
      message: 'Class updated successfully',
      data: classData
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * DELETE CLASS
 */
exports.deleteClass = async (req, res) => {
  try {
    const classData = await Class.findByPk(req.params.id);

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    await classData.destroy();

    return res.json({
      success: true,
      message: 'Class deleted successfully'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
