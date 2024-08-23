const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./api/user');
const procedureRoutes = require('./api/procedures');
const assetRoutes = require('./api/asset');
const runRoutes = require('./api/run');
const runPythonRoutes = require('./api/runScript');

const app = express();

// Middleware
app.use(cors({
  origin: 'https://testruns-recreation.vercel.app', 
  // origin:'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json()); // Parse JSON request bodies

// Connect to MongoDB using environment variable for security
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(error => console.error('MongoDB connection error:', error));

// Use routes
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/procedures', procedureRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/runs', runRoutes);
app.use('/api', runPythonRoutes);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
