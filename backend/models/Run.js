const mongoose = require('mongoose');

const runSchema = new mongoose.Schema({
  procedureID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Procedure'
  },
  procedureName: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  lab: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
  assignedBy: {
    type: String,
    required: true
  },
  objective: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Created', 'Started', 'Stopped', 'Completed', 'Submitted'],
    default: 'Created'
  },
  content: {
    type: String
  },
  inputValues: {
    type: mongoose.Schema.Types.Mixed
  }
});

module.exports = mongoose.model('Run', runSchema);
