const { listTokenOnStonFi } = require('@ston-fi/sdk');
const pool = require('../models/token');

const allocateTokens = async (tokenId, initialSupply) => {
  const userShare = initialSupply * 0.02;
  const marketMakingShare = initialSupply * 0.03;
  const exchangeShare = initialSupply * 0.10;

  try {
    // Insert transactions for user, market making, and exchange allocations
    await pool.query('INSERT INTO transactions (token_id, user_wallet_address, type, amount) VALUES (?, ?, ?, ?)', [tokenId, 'user_wallet_address', 'purchase', userShare]);
    await pool.query('INSERT INTO transactions (token_id, user_wallet_address, type, amount) VALUES (?, ?, ?, ?)', [tokenId, 'market_making_wallet_address', 'allocation', marketMakingShare]);
    await pool.query('INSERT INTO transactions (token_id, user_wallet_address, type, amount) VALUES (?, ?, ?, ?)', [tokenId, 'exchange_wallet_address', 'allocation', exchangeShare]);

    console.log('Tokens allocated successfully');
  } catch (error) {
    console.error('Error allocating tokens:', error);
  }
};

const listTokenOnStonFiFunction = async (token) => {
  try {
    // Assuming the SDK has a method to list a token on ston.fi
    await listTokenOnStonFi({
      name: token.name,
      symbol: token.symbol,
      initialSupply: token.initial_supply,
      marketCap: token.initial_supply * token.price, // Assuming there's a price property
    });

    console.log('Token listed on ston.fi successfully');
  } catch (error) {
    console.error('Error listing token on ston.fi:', error);
  }
};

module.exports = { allocateTokens, listTokenOnStonFi: listTokenOnStonFiFunction };
