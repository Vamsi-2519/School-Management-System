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


// exports.createClass = async (req, res) => {
//   try {
//     // Now supports x-www-form-urlencoded
//     const {
//       tenantDbName,
//       organizationId,
//       name,
//       section,
//       ClassTeacherName,
//       academicYear,
//       stream,
//       maxStrength,
//       currentStrength,
//       Schoolcode
//     } = req.body;

//     if (!name || !ClassTeacherName || !academicYear || !Schoolcode) {
//       return res.status(400).json({
//         success: false,
//         message: 'name, ClassTeacherName, academicYear and Schoolcode are required'
//       });
//     }

//     let dbName;
//     let resolvedOrgId = organizationId;

//     if (tenantDbName) {
//       dbName = tenantDbName;
//     } else if (organizationId) {
//       const org = await Organization.findByPk(organizationId);
//       if (!org) return res.status(404).json({ success: false, message: 'Organization not found' });
//       if (!org.tenantDb) return res.status(400).json({ success: false, message: 'No database configured for this organization' });
//       dbName = org.tenantDb;
//       resolvedOrgId = org.id; // Trusted UUID
//     } else {
//       return res.status(400).json({ success: false, message: 'tenantDbName or organizationId is required' });
//     }

//     const tenantSequelize = getTenantSequelize(dbName);
//     const Class = getClassModel(tenantSequelize);

//     const classData = await Class.create({
//       organizationId: resolvedOrgId, // Always use trusted value
//       name: name?.trim(),
//       section: section?.trim(),
//       ClassTeacherName: ClassTeacherName?.trim(),
//       academicYear,
//       stream: stream?.trim(),
//       maxStrength: maxStrength ? Number(maxStrength) : undefined,
//       currentStrength: currentStrength ? Number(currentStrength) : undefined,
//       Schoolcode: Schoolcode?.trim()
//     });

//     return res.status(201).json({
//       success: true,
//       message: 'Class created successfully',
//       data: classData
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: 'Create failed',
//       error: error.message
//     });
//   }
// };

const { Op } = require('sequelize');

exports.createClass = async (req, res) => {
    try {
        const {
            tenantDbName,
            organizationId,     // ← this should be VALID UUID string
            name,
            section,
            ClassTeacherName,
            academicYear,
            stream,
            maxStrength,
            currentStrength,
            Schoolcode
        } = req.body;

        // 1. Basic required fields validation
        if (!name?.trim() || !ClassTeacherName?.trim() || !academicYear || !Schoolcode?.trim()) {
            return res.status(400).json({
                success: false,
                message: 'name, ClassTeacherName, academicYear and Schoolcode are required'
            });
        }

        // 2. Organization / Database resolution
        let dbName;
        let resolvedOrgId;

        if (tenantDbName) {
            dbName = tenantDbName.trim();
            // When using tenantDbName directly → organizationId becomes mandatory
            if (!organizationId) {
                return res.status(400).json({
                    success: false,
                    message: 'organizationId is required when using tenantDbName'
                });
            }
            resolvedOrgId = organizationId;
        } 
        else if (organizationId) {
            // Validate UUID format early
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(organizationId)) {
              console.error(`Invalid organizationId received: ${organizationId}`);
              return res.status(400).json({
                success: false,
                message: `Invalid organizationId format: '${organizationId}'. Must be valid UUID (example: 550e8400-e29b-41d4-a716-446655440000)`
              });
            }

            const org = await Organization.findByPk(organizationId);
            if (!org) {
                return res.status(404).json({
                    success: false,
                    message: 'Organization not found'
                });
            }

            if (!org.tenantDb) {
                return res.status(400).json({
                    success: false,
                    message: 'No tenant database configured for this organization'
                });
            }

            dbName = org.tenantDb;
            resolvedOrgId = org.id; // ← always use the trusted value from DB
        } 
        else {
            return res.status(400).json({
                success: false,
                message: 'Either tenantDbName or organizationId is required'
            });
        }

        // 3. Get tenant connection & model
        const tenantSequelize = getTenantSequelize(dbName);
        const Class = getClassModel(tenantSequelize);

        // 4. Debug: show what we're actually trying to insert
        console.log('Creating class in DB:', dbName);
        console.log('Organization ID:', resolvedOrgId);
        console.log('Class name:', name.trim());

        // 5. Create record
        const newClass = await Class.create({
            organizationId: resolvedOrgId,      // ← guaranteed to be valid UUID
            name: name.trim(),
            section: section?.trim() || null,
            ClassTeacherName: ClassTeacherName.trim(),
            academicYear: academicYear.trim ? academicYear.trim() : academicYear,
            stream: stream?.trim() || null,
            maxStrength: maxStrength ? Number(maxStrength) : null,
            currentStrength: currentStrength ? Number(currentStrength) : null,
            Schoolcode: Schoolcode.trim(),
        }, {
            // VERY HELPFUL FOR DEBUGGING
            logging: console.log
        });

        return res.status(201).json({
            success: true,
            message: 'Class created successfully',
            data: newClass
        });

    } catch (error) {
        console.error('CLASS CREATE ERROR:', {
            message: error.message,
            stack: error.stack?.split('\n').slice(0, 3),
            sql: error.sql || null,
            original: error.original?.message || null
        });

        return res.status(500).json({
            success: false,
            message: 'Failed to create class',
            error: error.message,
            // hint: only show in development
            hint: error.message.includes('uuid') 
                ? 'Check if organizationId is valid UUID format' 
                : undefined
        });
    }
};

exports.getAllClasses = async (req, res) => {
  try {
    const { tenantDbName, organizationId } = req.query;
    const dbName = await resolveTenantDbName({ tenantDbName, organizationId });
    const tenantSequelize = getTenantSequelize(dbName);
    const Class = getClassModel(tenantSequelize);

    const where = organizationId ? { organizationId } : {};
    // const offset = (Number(page) - 1) * Number(limit);

    const { rows, count } = await Class.findAndCountAll({ where, order: [['createdAt', 'DESC']], offset });
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
