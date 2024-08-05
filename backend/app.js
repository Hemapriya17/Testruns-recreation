const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const procedureRoutes = require('./routes/procedures');
const assetRoutes = require('./routes/asset');
const runRoutes = require('./routes/run');
const runPythonRoutes = require('./routes/runPython');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3001', // Change this to match your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); // Enable CORS
app.use(bodyParser.json()); // Parse JSON request bodies

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/testruns', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(error => console.error('MongoDB connection error:', error));

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/procedures', procedureRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/runs', runRoutes);
app.use('/runPython', runPythonRoutes);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
