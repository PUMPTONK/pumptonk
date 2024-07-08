const express = require('express');
const { createUser, getUserByWalletAddress } = require('../controllers/userController');
const router = express.Router();

// Route to create a new user
router.post('/users', createUser);

// Route to get user by wallet address
router.get('/users/:walletAddress', getUserByWalletAddress);

module.exports = router;
