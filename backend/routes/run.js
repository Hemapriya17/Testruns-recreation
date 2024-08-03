const express = require('express');
const router = express.Router();
const runController = require('../controllers/run');

// Route to get all runs
router.get('/', runController.getRuns);
router.post('/', runController.createRun);
router.get('/:id', runController.getRunById);
router.put('/:id', runController.updateRun);
router.delete('/:id', runController.deleteRun);

module.exports = router;
