const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  address: String,
  position: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true,
    enum: ['Management', 'Sales', 'Warehouse', 'Accounting', 'IT']
  },
  salary: {
    type: Number,
    required: true,
    min: 0
  },
  hireDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on_leave'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);