const Run = require('../models/Run');
const Procedure = require('../models/Procedure');
const mongoose = require('mongoose');

// Get all runs with populated procedure details
const getRuns = async (req, res) => {
  try {
    const runs = await Run.find().populate({
      path: 'procedureID',
      select: 'procedureName content'
    }).exec();
    res.json(runs);
  } catch (error) {
    console.error('Error fetching runs:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get a single run by ID
const getRunById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Run ID format' });
  }

  try {
    const run = await Run.findById(id).exec();
    if (!run) {
      return res.status(404).json({ message: 'Run not found' });
    }

    const procedure = await Procedure.findById(run.procedureID).exec();
    if (!procedure) {
      return res.status(404).json({ message: 'Procedure not found' });
    }

    res.json({
      ...run.toObject(),
      procedureName: procedure.procedureName,
      content: procedure.content,
    });
  } catch (error) {
    console.error('Error fetching run by ID:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


// Create a new run
const createRun = async (req, res) => {
  const { procedureID, department, lab, dueDate, assignedBy, objective, status, content, inputValues } = req.body;

  try {
    if (!procedureID || !department || !lab || !dueDate || !objective) {
      return res.status(400).json({ message: 'All fields except "createdOn" are required' });
    }

    const procedure = await Procedure.findById(procedureID);
    if (!procedure) {
      return res.status(404).json({ message: 'Procedure not found' });
    }

    const newRun = new Run({
      procedureID,
      procedureName: procedure.procedureName,
      department,
      lab,
      dueDate,
      assignedBy: assignedBy || 'Default User',
      objective,
      status: status || 'Created',
      content,
      inputValues
    });

    const savedRun = await newRun.save();
    res.status(201).json(savedRun);
  } catch (error) {
    console.error('Error creating run:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Update an existing run
const updateRun = async (req, res) => {
  const { id } = req.params;
  const { status, content, inputValues } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Run ID format' });
    }

    const run = await Run.findById(id);
    if (!run) {
      return res.status(404).json({ message: 'Run not found' });
    }

    if (status) run.status = status;
    if (content) run.content = content;
    if (inputValues) run.inputValues = inputValues;

    const updatedRun = await run.save();
    res.status(200).json(updatedRun);
  } catch (error) {
    console.error('Error updating run:', error.message);
    res.status(500).json({ message: 'Failed to update run', error: error.message });
  }
};

// Delete a run
const deleteRun = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Run ID format' });
    }

    const deletedRun = await Run.findByIdAndDelete(id);
    if (!deletedRun) {
      return res.status(404).json({ message: 'Run not found' });
    }

    res.json({ message: 'Run deleted successfully' });
  } catch (error) {
    console.error('Error deleting run:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getRuns,
  getRunById,
  createRun,
  updateRun,
  deleteRun
};
