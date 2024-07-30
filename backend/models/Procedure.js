const mongoose = require('mongoose');

const ProcedureSchema = new mongoose.Schema({
  procedureID: { type: String, required: true, unique: true },
  procedureName: { type: String, required: true },
  department: { type: String, required: true },
  laboratory: { type: String, required: true },
  createdOn: { type: Date, default: Date.now, required: true },
  createdBy: { type: String, required: true },
  content: { type: String }
});

module.exports = mongoose.model('Procedure', ProcedureSchema);
