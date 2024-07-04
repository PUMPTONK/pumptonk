const { connectWallet } = require('toConnectService');

(async () => {
  try {
    const { wallet, walletDetails } = await connectWallet();
    console.log('Wallet Details:', JSON.stringify(walletDetails, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
