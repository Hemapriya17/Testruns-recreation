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
    type: String // Store the HTML content
  },
  inputValues: {
    type: Map,
    of: Number // Store the table input values
  }
});

module.exports = mongoose.model('Run', runSchema);



// const mongoose = require('mongoose');

// const runSchema = new mongoose.Schema({
//   procedureID: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Procedure',
//     required: true
//   },
//   procedureName: String,
//   department: String,
//   lab: String,
//   dueDate: Date,
//   createdOn: Date,
//   assignedBy: String,
//   objective: String,
// });

// const Run = mongoose.model('Run', runSchema);

// module.exports = Run;
