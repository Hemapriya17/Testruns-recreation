const Asset = require('../models/Asset'); // Assuming you have an Asset model

// Controller to get all assets
const getAssets = async (req, res) => {
  try {
    const assets = await Asset.find();
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Controller to create a new asset
const createAsset = async (req, res) => {
  const { assetName, purchaseDate, guaranteeExpiryDate, institute, org, dept, lab, status, availability } = req.body;

  // Optionally validate fields
  // if (!assetName || !purchaseDate || !guaranteeExpiryDate || !institute || !org || !dept || !lab || !status || !availability) {
  //   return res.status(400).json({ message: 'All fields are required' });
  // }

  try {
    const newAsset = new Asset({
      assetName,
      purchaseDate,
      guaranteeExpiryDate,
      institute,
      org,
      dept,
      lab,
      status,
      availability
    });

    const savedAsset = await newAsset.save();
    res.status(201).json(savedAsset);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Controller to update an asset
const updateAsset = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedAsset = await Asset.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedAsset) return res.status(404).json({ message: 'Asset not found' });
    res.json(updatedAsset);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Controller to delete an asset
const deleteAsset = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAsset = await Asset.findByIdAndDelete(id);
    if (!deletedAsset) return res.status(404).json({ message: 'Asset not found' });
    res.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getAssets,
  createAsset,
  updateAsset,
  deleteAsset
};
