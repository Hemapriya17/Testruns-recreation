const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const procedureRoutes = require('./routes/procedures');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/testruns')
// , {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/procedures', procedureRoutes);

module.exports = app;
