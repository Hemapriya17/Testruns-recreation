const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const procedureRoutes = require('./routes/procedures');
const assetRoutes = require('./routes/asset');
const runRoutes = require('./routes/run');
const runPythonRoutes = require('./routes/runScript');

const app = express();

// Middleware
app.use(cors({
  origin: 'https://testruns-recreation.vercel.app', // Ensure this matches your frontend URL
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
