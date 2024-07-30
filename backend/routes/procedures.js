const express = require('express');
const router = express.Router();
const procedureController = require('../controllers/procedures');

// Define routes
router.get('/', procedureController.getProcedures);
router.post('/', procedureController.createProcedure);
router.put('/:id', procedureController.updateProcedure);
router.delete('/:id', procedureController.deleteProcedure);
router.get('/nextID', procedureController.getNextProcedureID);

module.exports = router;
