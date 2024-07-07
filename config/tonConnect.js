// config/tonConnect.js

const { LocalStorage } = require('node-localstorage');
const { TonConnect } = require('@tonconnect/sdk');

// Set up localStorage for Node.js environment
const localStorage = new LocalStorage('./scratch');

const tonConnect = new TonConnect({
  storage: localStorage,
  manifestUrl: 'http://localhost:2000/tonconnect-manifest.json', // Ensure this URL points to your manifest file
});

module.exports = tonConnect;
