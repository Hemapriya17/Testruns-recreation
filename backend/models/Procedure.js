const mongoose = require('mongoose');

const procedureSchema = new mongoose.Schema({
  procedureName: String,
  department: String,
  laboratory: String,
  content: String,
  userId: mongoose.Schema.Types.ObjectId,
  createdBy: String,
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset' }, // Add asset reference
  createdOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Procedure', procedureSchema);
