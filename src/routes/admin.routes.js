
const express = require('express');
const router = express.Router();

const classController = require('../controllers/admin/class.controller');
const studentController = require('../controllers/admin/student.controller');
const teacherController = require('../controllers/admin/teacher.controller');
const inventoryController = require('../controllers/admin/inventory.controller');
const feePaymentController = require('../controllers/admin/fee.controller');

// const authMiddleware = require('../middlewares/auth.middlewares');
const { tenantDbMiddleware } = require('../middlewares/tenant.middleware');

/**
 * CLASS ROUTES
 */
router.post('/createclasses', classController.createClass);
router.get('/classes', classController.getAllClasses);
router.get('/classes/:id', classController.getClassById);
router.put('/classes/:id', classController.updateClass);
router.delete('/classes/:id', classController.deleteClass);

// STUDENT ROUTES
router.post('/students', tenantDbMiddleware, studentController.createStudent);
router.get('/students', tenantDbMiddleware, studentController.getAllStudents);
router.get('/students/:id', tenantDbMiddleware, studentController.getStudentById);
router.put('/students/:id', tenantDbMiddleware, studentController.updateStudent);
router.delete('/students/:id', tenantDbMiddleware, studentController.deleteStudent);



// CREATE FEE PAYMENT
router.post('/fee', feePaymentController.createFeePayment);
router.get('/fee', feePaymentController.getAllFeePayments);
router.get('/fee:id', feePaymentController.getFeePaymentById);
router.put('/fee:id', feePaymentController.updateFeePayment);
router.delete('/fee:id', feePaymentController.deleteFeePayment);


// TEACHER ROUTES
router.post('/teachers', teacherController.createTeacher);
router.get('/teachers', teacherController.getAllTeachers);
router.get('/teachers/:id', teacherController.getTeacherById);
router.put('/teachers/:id', teacherController.updateTeacher);
router.delete('/teachers/:id', teacherController.deleteTeacher);



// Protected routes
router.post('/inventory', inventoryController.createInventory);
router.get('/inventory', inventoryController.getAllInventory);
router.get('/inventory:id', inventoryController.getInventoryById);
router.put('/inventory:id', inventoryController.updateInventory);
router.delete('/inventory:id', inventoryController.deleteInventory);




module.exports = router;
