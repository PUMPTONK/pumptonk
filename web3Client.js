/****
 * Author: adex1maths@gmail.com
 * ***/

const Web3 = require('web3');

let web3;

try {
  web3 = new Web3(`https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID`);
  console.log('Connected to Ethereum network');
} catch (error) {
  console.error('Error initializing Web3 client:', error.message);
  process.exit(1); // Exit the process if unable to connect
}

module.exports = web3;
