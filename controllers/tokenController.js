const crypto = require('crypto');
const pool = require('../models/token');
const { allocateTokens, listTokenOnStonFi } = require('../services/tokenService');
const path = require('path');
const axios = require('axios');


//websocket declaration
const express = require('express');
const http = require('http');
const WebSocket = require('ws');


const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());



// Example environment variables
const DEPLOYMENT_FEE_TONS = process.env.DEPLOYMENT_FEE_TONS || 2;
const TON_SMART_CONTRACT_ADDRESS = process.env.TON_SMART_CONTRACT_ADDRESS;
const TON_V2_API_KEY = process.env.TON_V2_API_KEY;

// Function to deduct deployment fee and remit to designated wallet
const deductDeploymentFee = async (userWalletAddress) => {
  try {
    // Example: Check user's wallet balance using TON V2 API
    const response = await axios.get(`https://sandbox.tonhubapi.com/getAddressInformation?address=${userWalletAddress}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TON_V2_API_KEY}`,
      },
    });

    //let userBalance = 5;
    let userBalance = parseFloat(response.data.result.balance);
    let deploymentFee = parseFloat(DEPLOYMENT_FEE_TONS);

    console.log('User Balance:', userBalance);
    console.log('Deployment Fee:', deploymentFee);

    if (isNaN(deploymentFee)) {
      throw new Error('Invalid balance or deployment fee');
    }

    if (userBalance < deploymentFee) {
      throw new Error('Insufficient balance');
    }

    // Deduct deployment fee from user's wallet
    const newBalance = userBalance - deploymentFee;
    console.log('New Balance:', newBalance);

    // Update user's wallet balance in the database
    await pool.query('UPDATE users SET balance = ? WHERE walletAddress = ?', [newBalance, userWalletAddress]);

    // Remit deployment fee to designated wallet (TON Smart Contract)
    // Example: Call TON Smart Contract method using axios or appropriate SDK
    const remitResponse = await axios.post(`https://sandbox.tonhubapi.com/runGetMethod`, {
      contractAddress: TON_SMART_CONTRACT_ADDRESS,
      method: 'runGetMethod',
      params: {
        userWalletAddress,
        amount: deploymentFee,
      },
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TON_V2_API_KEY}`,
      },
    });

    console.log('Deployment fee remitted:', remitResponse.data);

    return true;
  } catch (error) {
    console.error('Error deducting deployment fee:', error.message);
    throw error;
  }
};


// Create Token with token transaction hash
const createToken = async (req, res) => {
  const { name, user_id, symbol, description, initialSupply, twitterLink, telegramLink, websiteLink, userWalletAddress } = req.body;
  const tokenImage = req.file ? req.file.path : null;

  if (req.file && req.file.size > 10 * 1024 * 1024) {
    return res.status(400).json({ message: 'Token image size should not exceed 10MB' });
  }

  // Generate Innital Market Cap price for new token, replace this according to website trading policy
  const market_value_of_a_token = 1; // Assumes 1token = 1 TONS. Change thsi any time
  const inital_value = market_value_of_a_token * initialSupply;
  const innitialmarketCap = parseFloat(inital_value);

  // Generate transaction hash
  const transactionHash = crypto.createHash('sha256').update(`${name}${symbol}${userWalletAddress}${Date.now()}`).digest('hex');

  try {

     // Deduct deployment fee from user's wallet
     await deductDeploymentFee(userWalletAddress);

    const [result] = await pool.query(
      'INSERT INTO tokens (name, user_id, symbol, description, token_image, initial_supply, currentSupply, marketCap, twitter_link, telegram_link, website_link, user_wallet_address, transaction_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, user_id, symbol, description, tokenImage, initialSupply, initialSupply, innitialmarketCap, twitterLink, telegramLink, websiteLink, userWalletAddress, transactionHash]
    );

    const tokenId = result.insertId;

    // Allocate tokens
    await allocateTokens(tokenId, initialSupply);

    const [token] = await pool.query('SELECT * FROM tokens WHERE id = ?', [tokenId]);
    await listTokenOnStonFi(token[0]);

    // Retrieve the inserted transaction
    const [create_token_notification] = await pool.execute(
      `SELECT * FROM tokens WHERE id = ?`,
      [result.insertId]
    );

    // Notify all connected WebSocket clients
    const notification = {
      create_token_notification: create_token_notification[0],
      token: token[0]
    };
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(notification));
      }
    });

    res.status(201).json(notification);
    
    // Respond with success message
    //res.status(201).json({ message: 'Token created successfully', tokenId, transactionHash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Bonding Curve Price Calculation
const calculateBondingCurvePrice = (initialSupply, currentSupply) => {
  // Linear Bonding Curve Formula
  const k = 0.1; // Some constant for the curve
  const price = k * (initialSupply - currentSupply);
  return price;
};

// Like Token
const likeToken = async (req, res) => {
  const { id } = req.params;
  const { userWalletAddress } = req.body;

  try {
    await pool.query(
      'INSERT INTO liked_tokens (token_id, user_wallet_address) VALUES (?, ?)',
      [id, userWalletAddress]
    );
    res.status(201).json({ message: 'Token liked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Buy Token
const buyToken = async (req, res) => {
  const { id } = req.params;
  const { userWalletAddress, amount } = req.body;

  try {
    // Fetch token details
    const [token] = await pool.query('SELECT * FROM tokens WHERE id = ?', [id]);

    if (token.length === 0) {
      return res.status(404).json({ message: 'Token not found' });
    }

    const { initial_supply, currentSupply, marketCap } = token[0];

    // Calculate bonding curve price
    const price = calculateBondingCurvePrice(initial_supply, currentSupply);

    // Update current supply and market cap
    const newSupply = currentSupply - amount;
    const newMarketCap = marketCap + price * amount;

    // Update the database
    await pool.query('UPDATE tokens SET currentSupply = ?, marketCap = ?, bondingCurvePrice = ? WHERE id = ?', [newSupply, newMarketCap, price, id]);
    const [result]= await pool.query('INSERT INTO transactions (token_id, user_wallet_address, type, amount) VALUES (?, ?, ?, ?)', [id, userWalletAddress, 'buy', amount]);

    // Generate websocket notification
    // Retrieve the inserted transaction
    const [buy_token_notification] = await pool.execute(
      `SELECT * FROM transactions WHERE id = ?`,
      [result.insertId]
    );

    // Notify all connected WebSocket clients
    const buy_notification = {
      buy_token_notification: buy_token_notification[0],
      bought_token_details: token[0]
    };
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(buy_notification));
      }
    });

    //send notification to websocket

    res.status(201).json(buy_notification);

    //res.status(201).json({ message: 'Token purchased successfully', price });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
// Sell Token
const sellToken = async (req, res) => {
  const { id } = req.params;
  const { userWalletAddress, amount } = req.body;

  try {
    const [result] = await pool.query(
      'INSERT INTO transactions (token_id, user_wallet_address, type, amount) VALUES (?, ?, ?, ?)',
      [id, userWalletAddress, 'sell', amount]
    );

    // Retrieve the inserted transaction
    const [sold_token_transaction_notification] = await pool.execute(
      `SELECT * FROM transactions WHERE id = ?`,
      [result.insertId]
    );

    // Retrieve the token details to generate websocket notification
    const [token] = await pool.execute(
      `SELECT * FROM tokens WHERE id = ?`,
      [id]
    );

    // Notify all connected WebSocket clients
    const sold_tokens_notification = {
      sold_token_transaction_notification: sold_token_transaction_notification[0],
      sold_token_details: token[0]
    };
    
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(sold_tokens_notification));
      }
    });

    //Geneate Notification
    res.status(201).json(sold_tokens_notification);
    //res.status(201).json({ message: 'Token sold successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

// Supply Token
const supplyToken = async (req, res) => {
  const { id } = req.params;
  const { userWalletAddress, amount } = req.body;

  try {
    await pool.query(
      'INSERT INTO transactions (token_id, user_wallet_address, type, amount) VALUES (?, ?, ?, ?)',
      [id, userWalletAddress, 'supply', amount]
    );
    res.status(201).json({ message: 'Token supplied successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Token
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



// Get Token Details by ID
const getTokenDetailsById = async (req, res) => {
  const { id } = req.params;

  try {
    const [token] = await pool.query('SELECT marketCap, initial_supply, currentSupply FROM tokens WHERE id = ?', [id]);

    if (token.length === 0) {
      return res.status(404).json({ message: 'Token not found' });
    }

    res.status(200).json(token[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Tokens by User ID
const getTokensByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const [tokens] = await pool.query('SELECT * FROM tokens WHERE user_id = ?', [userId]);

    if (tokens.length === 0) {
      return res.status(404).json({ message: 'No tokens found for this user' });
    }

    res.status(200).json(tokens);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search Tokens
const searchTokens = async (req, res) => {
  const { query } = req.query;

  try {
    const [tokens] = await pool.query('SELECT * FROM tokens WHERE name LIKE ?', [`%${query}%`]);
    res.status(200).json(tokens);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// WebSocket connection
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  ws.send(JSON.stringify({ message: 'Welcome to the WebSocket server' }));
});


module.exports = { createToken, likeToken, buyToken, sellToken, supplyToken, getToken, searchTokens, getTokenDetailsById, getTokensByUserId  };
