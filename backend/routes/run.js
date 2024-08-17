const express = require('express');
const router = express.Router();
const runController = require('../controllers/run');

// Route to get all runs
router.get('/', runController.getRuns);
router.post('/', runController.createRun);
router.get('/:id', runController.getRunById);
router.put('/:id', runController.updateRun);
router.delete('/:id', runController.deleteRun);
router.post('/:id/start', runController.startRun);
router.post('/:id/stop', runController.stopRun);

module.exports = router;
