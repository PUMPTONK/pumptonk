const { connectToDatabase } = require('../config/db');
const { connectWallet } = require('../services/tonConnectService');

const connectWalletController = async (req, res) => {
  const { user_id, email } = req.body;

  try {
    const { walletDetails } = await connectWallet();

    const connection = await connectToDatabase();
    const userQuery = 'INSERT INTO users (email, user_id) VALUES (?, ?)';
    const [result] = await connection.execute(userQuery, [email, user_id]);

    res.json({ walletDetails, userId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { connectWallet: connectWalletController };
