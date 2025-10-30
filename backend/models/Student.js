const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  rollNo: {
    type: String,
    required: [true, 'Please add a roll number'],
    unique: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  department: {
    type: String,
    required: [true, 'Please add a department']
  },
  year: {
    type: Number,
    required: [true, 'Please add a year'],
    min: 1,
    max: 4
  },
  section: {
    type: String,
    required: [true, 'Please add a section']
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  attendance: {
    present: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },
  marks: [{
    subject: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    }
  }],
  profilePhoto: {
    type: String,
    default: 'default.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual field for attendance percentage
studentSchema.virtual('attendancePercentage').get(function() {
  if (this.attendance.total === 0) return 0;
  return ((this.attendance.present / this.attendance.total) * 100).toFixed(2);
});

// Virtual field for average marks
studentSchema.virtual('averageMarks').get(function() {
  if (this.marks.length === 0) return 0;
  const total = this.marks.reduce((sum, mark) => sum + mark.score, 0);
  return (total / this.marks.length).toFixed(2);
});

// Cascade delete user when a student is deleted
studentSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  await this.model('User').deleteOne({ studentId: this._id });
  next();
});

module.exports = mongoose.model('Student', studentSchema);