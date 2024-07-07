// controllers/walletController.js

const tonService = require('../services/tonService');
const tonConnect = require('../config/tonConnect');

const connectWallet = async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ message: 'Wallet address is required' });
    }

    const walletBalance = await tonService.getWalletBalance(walletAddress);

    res.json({ walletAddress, walletBalance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { connectWallet };
