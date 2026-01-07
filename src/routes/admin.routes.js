const express = require('express');
const router = express.Router();

const classController = require('../../src/controllers/admin/class.controller');

/**
 * CLASS ROUTES
 */

// CREATE class
router.post('/', classController.createClass);


router.get('/', classController.getAllClasses);

// GET class by ID
router.get('/:id', classController.getClassById);

// UPDATE class
router.put('/:id', classController.updateClass);

// DELETE class
router.delete('/:id', classController.deleteClass);

module.exports = router;
