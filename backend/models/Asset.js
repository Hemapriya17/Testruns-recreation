const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  assetName: String,
  purchaseDate: Date,
  guaranteeExpiryDate: Date,
  institute: String,
  org: String,
  dept: String,
  lab: String,
  status: String,
  availability: { type: String, default: 'Available' },
});

module.exports = mongoose.model('Asset', assetSchema);
