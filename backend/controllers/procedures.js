const Procedure = require('../models/Procedure');
const User = require('../models/User');

// Get all procedures
exports.getProcedures = async (req, res) => {
  try {
    const procedures = await Procedure.find().populate('createdBy', 'firstName lastName');
    res.json(procedures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new procedure
exports.createProcedure = async (req, res) => {
  try {
    const { userId, procedureName } = req.body;

    if (!userId || !procedureName) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the latest Procedure ID
    const lastProcedure = await Procedure.findOne().sort({ createdOn: -1 }).exec();
    const lastId = lastProcedure ? parseInt(lastProcedure.procedureID.replace('PRO', '')) : 0;
    const newId = `PRO${String(lastId + 1).padStart(2, '0')}`;

    // Create new procedure
    const procedure = new Procedure({
      procedureID: newId,
      procedureName,
      createdOn: new Date(),
      department: 'Dept 1',
      laboratory: 'Lab 1',
      createdBy: `${user.firstName} ${user.lastName}`
    });

    await procedure.save();
    res.status(201).json(procedure);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a procedure
exports.updateProcedure = async (req, res) => {
  try {
    const { id } = req.params;
    const { procedureName, content, userId } = req.body;

    // Find the procedure by ID and update it
    const updatedProcedure = await Procedure.findByIdAndUpdate(
      id,
      { procedureName, content, userId },
      { new: true }
    );

    if (!updatedProcedure) {
      return res.status(404).json({ message: "Procedure not found" });
    }

    res.json(updatedProcedure);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a procedure
exports.deleteProcedure = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProcedure = await Procedure.findByIdAndDelete(id);
    if (!deletedProcedure) {
      return res.status(404).json({ message: "Procedure not found" });
    }
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Generate the next Procedure ID
exports.getNextProcedureID = async (req, res) => {
  try {
    const lastProcedure = await Procedure.findOne().sort({ procedureID: -1 });
    let nextID = 'PRO01';
    if (lastProcedure) {
      const lastID = lastProcedure.procedureID;
      const num = parseInt(lastID.replace('PRO', ''), 10) + 1;
      nextID = 'PRO' + num.toString().padStart(2, '0');
    }
    res.json({ nextID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
