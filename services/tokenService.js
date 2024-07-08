const pool = require('../models/token');
const { StonFi } = require('@ston-fi/sdk');

const allocateTokens = async (tokenId, initialSupply) => {
  const userWalletAllocation = (initialSupply * 2) / 100;
  const marketMakerWalletAllocation = (initialSupply * 3) / 100;
  const exchangeWalletAllocation = (initialSupply * 10) / 100;

  const userWallet = 'user_wallet_address';
  const marketMakerWallet = 'market_maker_wallet_address';
  const exchangeWallets = ['exchange_wallet_address1', 'exchange_wallet_address2'];

  try {
    await pool.query('UPDATE tokens SET allocated_to_user_wallet = ? WHERE id = ?', [userWalletAllocation, tokenId]);
    await pool.query('UPDATE tokens SET allocated_to_market_maker_wallet = ? WHERE id = ?', [marketMakerWalletAllocation, tokenId]);

    for (const exchangeWallet of exchangeWallets) {
      await pool.query('UPDATE tokens SET allocated_to_exchange_wallets = ? WHERE id = ?', [exchangeWalletAllocation / exchangeWallets.length, tokenId]);
    }
  } catch (error) {
    console.error('Error allocating tokens:', error);
  }
};

const listTokenOnStonFi = async (token) => {
  const stonfi = new StonFi();

  try {
    const response = await stonfi.listToken({
      symbol: token.symbol,
      name: token.name,
      description: token.description,
      image: token.token_image,
      initialSupply: token.initial_supply,
      marketMakerWallet: 'market_maker_wallet_address',
      userWallet: 'user_wallet_address',
    });

    console.log('Token listed on ston.fi:', response);
  } catch (error) {
    console.error('Error listing token on ston.fi:', error);
  }
};

module.exports = { allocateTokens, listTokenOnStonFi };
