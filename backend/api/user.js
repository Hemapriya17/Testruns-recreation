const express = require('express');
const router = express.Router();
const userController = require('../controllers/users'); 

// Define routes
router.get('/', userController.getUsers); 
router.post('/', userController.createUser); 
router.put('/:id', userController.updateUser); 
router.delete('/:id', userController.deleteUser);
router.get('/current', userController.getCurrentUser);

module.exports = router;
