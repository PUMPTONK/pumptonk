const pool = require('../models/user');

// Create a new user
const createUser = async (req, res) => {
  const { walletAddress } = req.body;

  try {
    const [existingUser] = await pool.query('SELECT * FROM users WHERE wallet_address = ?', [walletAddress]);
    
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'User already exists' });
    }

    await pool.query('INSERT INTO users (wallet_address) VALUES (?)', [walletAddress]);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user by wallet address
const getUserByWalletAddress = async (req, res) => {
  const { walletAddress } = req.params;

  try {
    const [user] = await pool.query('SELECT * FROM users WHERE wallet_address = ?', [walletAddress]);

    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createUser, getUserByWalletAddress };
