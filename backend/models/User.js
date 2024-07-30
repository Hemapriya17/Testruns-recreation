// models/Users.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  institute: String,
  org: String,
  dept: String,
  lab: String,
  role: String,
  userStatus: { type: String, default: 'Active' },
  addDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
