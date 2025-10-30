const Student = require('../models/Student');
const User = require('../models/User');

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if user is admin or the student themselves
    if (req.user.role !== 'admin' && req.user.studentId.toString() !== student._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this student\'s information'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Create new student
// @route   POST /api/students
// @access  Private/Admin
exports.createStudent = async (req, res) => {
  try {
    // Check if student with same email or roll number exists
    const existingStudent = await Student.findOne({
      $or: [
        { email: req.body.email },
        { rollNo: req.body.rollNo }
      ]
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: existingStudent.email === req.body.email 
          ? 'Email already exists' 
          : 'Roll number already exists'
      });
    }

    // Create student
    const student = await Student.create(req.body);

    // Create user account for student
    await User.create({
      email: student.email,
      password: 'changeme123', // Temporary password
      role: 'student',
      studentId: student._id
    });

    res.status(201).json({
      success: true,
      data: student
    });
  } catch (err) {
    // Check for validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    // Handle other errors
    res.status(400).json({
      success: false,
      message: err.message || 'Something went wrong'
    });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin
exports.updateStudent = async (req, res) => {
  try {
    let student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Handle file upload
    if (req.file) {
      req.body.profilePhoto = req.file.filename;
    }

    student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Delete associated user account
    await User.deleteOne({ studentId: student._id });

    // Use deleteOne instead of remove()
    await Student.deleteOne({ _id: student._id });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};