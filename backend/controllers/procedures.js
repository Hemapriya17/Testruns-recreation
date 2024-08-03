const Procedure = require('../models/Procedure');
const User = require('../models/User');
const Asset = require('../models/Asset');

// Get all procedures
exports.getProcedures = async (req, res) => {
  try {
    const procedures = await Procedure.find()
      .populate('createdBy', 'firstName lastName')
      .populate('asset', 'assetName'); // Populate asset details

    res.json(procedures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new procedure
exports.createProcedure = async (req, res) => {
  try {
    const { userId, procedureName, assetId } = req.body;

    if (!userId || !procedureName) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let asset = null;
    if (assetId) {
      asset = await Asset.findById(assetId);
      if (!asset) {
        return res.status(404).json({ message: "Asset not found" });
      }
    }

    // Create new procedure
    const procedure = new Procedure({
      procedureName,
      createdOn: new Date(),
      department: 'Dept 1',
      laboratory: 'Lab 1',
      createdBy: `${user.firstName} ${user.lastName}`,
      asset: asset ? asset._id : null // Set the asset reference
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
    const { procedureName, content, userId, assetId } = req.body;

    if (assetId) {
      const asset = await Asset.findById(assetId);
      if (!asset) {
        return res.status(404).json({ message: "Asset not found" });
      }
    }

    const updatedProcedure = await Procedure.findByIdAndUpdate(
      id,
      { procedureName, content, userId, asset: assetId }, // Update asset reference
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

// Get a procedure by ID
exports.getProcedureById = async (req, res) => {
  try {
    const procedure = await Procedure.findById(req.params.id)
      .populate('asset', 'assetName'); // Populate asset details if needed
    if (!procedure) {
      return res.status(404).json({ message: "Procedure not found" });
    }
    res.json(procedure);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
