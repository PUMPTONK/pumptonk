
const { TonConnect } = require('@tonconnect/sdk');
const { connectToDatabase } = require('../config/db');
require('../utils/mockLocalStorage'); // Add this line to mock localStorage

const tonConnect = new TonConnect({
    manifestUrl: 'http://localhost:9000/tonconnect-manifest.json' // Update with your manifest URL
});

const retrieveTokens = async (req, res) => {
    try {
        const { user_id } = req.body;

        // Retrieve tokens using TON Connect (this is a placeholder, update as needed)
        const tokens = await tonConnect.retrieveTokens(user_id);

        res.json({ tokens });
    } catch (error) {
        console.error('Error retrieving tokens:', error);
        res.status(500).json({ error: error.message });
    }
};

const createToken = async (req, res) => {
    const { user_id, name, symbol, description, image, twitter_link } = req.body;

    try {
        const connection = await connectToDatabase();
        const tokenQuery = 'INSERT INTO tokens (user_id, name, symbol, description, image, twitter_link) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await connection.execute(tokenQuery, [user_id, name, symbol, description, image, twitter_link]);

        const token = { user_id, name, symbol, description, image, twitter_link, id: result.insertId };
        res.json({ tokenId: result.insertId, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const likeToken = async (req, res) => {
    const { user_id, token_id } = req.body;

    try {
        const connection = await connectToDatabase();

        // Check if the user has already liked the token
        const checkLikeQuery = 'SELECT * FROM liked_tokens WHERE user_id = ? AND token_id = ?';
        const [existingLike] = await connection.execute(checkLikeQuery, [user_id, token_id]);

        if (existingLike.length > 0) {
            return res.status(400).json({ error: 'User has already liked this token' });
        }

        // If not already liked, insert the like
        const likeQuery = 'INSERT INTO liked_tokens (user_id, token_id) VALUES (?, ?)';
        const [result] = await connection.execute(likeQuery, [user_id, token_id]);

        res.json({ likedTokenId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const purchaseToken = async (req, res) => {
    const { user_id, token_id, purchase_amount } = req.body;

    try {
        const connection = await connectToDatabase();
        const purchaseQuery = 'INSERT INTO purchased_tokens (user_id, token_id, purchase_amount) VALUES (?, ?, ?)';
        const [result] = await connection.execute(purchaseQuery, [user_id, token_id, purchase_amount]);

        res.json({ purchaseId: result.insertId, purchase_amount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { retrieveTokens, createToken, likeToken, purchaseToken };
