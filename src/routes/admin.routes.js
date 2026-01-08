const express = require('express');
const router = express.Router();

const classController = require('../controllers/admin/class.controller');
const studentController = require('../controllers/admin/student.controller');
const teacherController = require('../controllers/admin/teacher.controller');

/**
 * CLASS ROUTES
 */

// GET class by ID
// UPDATE class
// DELETE class
// CLASS ROUTES (keep existing)
router.post('/createclasses', classController.createClass);
router.get('/classes', classController.getAllClasses);
router.get('/classes/:id', classController.getClassById);
router.put('/classes/:id', classController.updateClass);
router.delete('/classes/:id', classController.deleteClass);

// STUDENT ROUTES
router.post('/students', studentController.createStudent);
router.get('/students', studentController.getAllStudents);
router.get('/students/:id', studentController.getStudentById);
router.put('/students/:id', studentController.updateStudent);
router.delete('/students/:id', studentController.deleteStudent);

// TEACHER ROUTES
router.post('/teachers', teacherController.createTeacher);
router.get('/teachers', teacherController.getAllTeachers);
router.get('/teachers/:id', teacherController.getTeacherById);
router.put('/teachers/:id', teacherController.updateTeacher);
router.delete('/teachers/:id', teacherController.deleteTeacher);

module.exports = router;
