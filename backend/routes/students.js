const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/students');

const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect); // Protect all routes

router
  .route('/')
  .get(getStudents)
  .post(authorize('admin'), createStudent);

router
  .route('/:id')
  .get(getStudent)
  .put(authorize('admin'), upload.single('profilePhoto'), updateStudent)
  .delete(authorize('admin'), deleteStudent);

module.exports = router;