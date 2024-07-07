// services/tonService.js

const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const tonService = {
  async getWalletBalance(walletAddress) {
    try {
      const response = await axios.get(`${process.env.TON_API_URL}/getAddressBalance`, {
        params: {
          address: walletAddress,
          //api_key: process.env.TON_API_KEY, //Comment out to use TON SDK directly
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch wallet balance');
    }
  },
};

module.exports = tonService;
