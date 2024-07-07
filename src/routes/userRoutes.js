// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middleware/uploadMiddleware');

router.post('/update', upload.single('profilePicture'), userController.updateUser);

module.exports = router;
