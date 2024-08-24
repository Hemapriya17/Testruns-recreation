// routes/asset.js
const express = require('express');
const router = express.Router();
const assetController = require('../controllers/asset');

// Define routes
router.get('/', assetController.getAssets);
router.post('/', assetController.createAsset);
router.put('/:id', assetController.updateAsset);
router.delete('/:id', assetController.deleteAsset);

module.exports = router;
