const { TonConnect } = require('@tonconnect/sdk');
const { LocalStorage } = require('node-localstorage');
const fs = require('fs');
const path = require('path');

// Set up localStorage for Node.js
const localStorage = new LocalStorage('./scratch');
global.localStorage = localStorage;

// Load Dapp metadata
const dappMetadata = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../tonconnect-manifest.json'), 'utf-8'));

const tonConnect = new TonConnect({
  manifestUrl: dappMetadata.url,
  metadata: {
    name: dappMetadata.name,
    icon: dappMetadata.icon,
  }
});

const connectWallet = async () => {
  try {
    // The connection process might need to specify how to connect
    const walletConnectionResult = await tonConnect.connect();
    
    // Check if the wallet connection result is valid
    if (!walletConnectionResult) {
      throw new Error('Failed to establish a wallet connection');
    }

    // Assuming getWalletDetails is a valid method
    const walletDetails = await walletConnectionResult.getDetails();
    return { wallet: walletConnectionResult, walletDetails };
  } catch (error) {
    throw new Error('Failed to connect to wallet: ' + error.message);
  }
};

module.exports = { connectWallet };
