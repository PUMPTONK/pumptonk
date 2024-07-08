const pool = require('../models/token');
const { allocateTokens, listTokenOnStonFi } = require('../services/tokenService');

const createToken = async (req, res) => {
  const { name, symbol, description, tokenImage, initialSupply, twitterLink, telegramLink, websiteLink, userWalletAddress } = req.body;

  try {
    const [result] = await pool.query(
      'INSERT INTO tokens (name, symbol, description, token_image, initial_supply, twitter_link, telegram_link, website_link, user_wallet_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, symbol, description, tokenImage, initialSupply, twitterLink, telegramLink, websiteLink, userWalletAddress]
    );

    const tokenId = result.insertId;

    await allocateTokens(tokenId, initialSupply);

    const [token] = await pool.query('SELECT * FROM tokens WHERE id = ?', [tokenId]);
    await listTokenOnStonFi(token[0]);

    res.status(201).json({ message: 'Token created successfully', tokenId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const likeToken = async (req, res) => {
  const { id } = req.params;
  const { userWalletAddress } = req.body;

  try {
    await pool.query('INSERT INTO liked_tokens (token_id, user_wallet_address) VALUES (?, ?)', [id, userWalletAddress]);
    res.status(200).json({ message: 'Token liked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const buyToken = async (req, res) => {
  const { id } = req.params;
  const { userWalletAddress, amount } = req.body;

  try {
    await pool.query('INSERT INTO transactions (token_id, user_wallet_address, type, amount) VALUES (?, ?, ?, ?)', [id, userWalletAddress, 'buy', amount]);
    res.status(200).json({ message: 'Token bought successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const sellToken = async (req, res) => {
  const { id } = req.params;
  const { userWalletAddress, amount } = req.body;

  try {
    await pool.query('INSERT INTO transactions (token_id, user_wallet_address, type, amount) VALUES (?, ?, ?, ?)', [id, userWalletAddress, 'sell', amount]);
    res.status(200).json({ message: 'Token sold successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const supplyToken = async (req, res) => {
  const { id } = req.params;
  const { userWalletAddress, amount } = req.body;

  try {
    await pool.query('INSERT INTO transactions (token_id, user_wallet_address, type, amount) VALUES (?, ?, ?, ?)', [id, userWalletAddress, 'supply', amount]);
    res.status(200).json({ message: 'Token supplied successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getToken = async (req, res) => {
  const { id } = req.params;

  try {
    const [token] = await pool.query('SELECT * FROM tokens WHERE id = ?', [id]);

    if (token.length === 0) {
      return res.status(404).json({ message: 'Token not found' });
    }

    res.status(200).json(token[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const searchTokens = async (req, res) => {
  const { query } = req.query;

  try {
    const [tokens] = await pool.query('SELECT * FROM tokens WHERE name LIKE ? OR symbol LIKE ?', [`%${query}%`, `%${query}%`]);

    res.status(200).json(tokens);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createToken, likeToken, buyToken, sellToken, supplyToken, getToken, searchTokens };
