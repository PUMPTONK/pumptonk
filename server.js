/**
 * Developed by: adex1maths@gmail.com
 * Copyright: July, 2024
 * TONK
 * **/

const express = require('express');
const web3 = require('./web3Client');
const tonClient = require('./tonClient');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

/**
 * 
 * Obtain the ABI: Ensure you have the ABI (Application Binary Interface) of your Free TON smart contract. The ABI is typically provided 
 * in a JSON format and contains the methods, inputs, and outputs of your smart contract.
 * 
 * 
 * Replace the Placeholder: In the server.js file, replace the contractAbi placeholder with the actual ABI JSON 
 * of your Free TON smart contract.
 * 
 * 
 */
const contractAbi = {
  "ABI version": 2,
  "header": ["time", "expire"],
  "functions": [
    {
      "name": "getBalance",
      "inputs": [],
      "outputs": [
        { "name": "balance", "type": "uint128" }
      ]
    },
    {
      "name": "transfer",
      "inputs": [
        { "name": "to", "type": "address" },
        { "name": "value", "type": "uint128" }
      ],
      "outputs": []
    }
    // Add other methods as needed
  ],
  "data": [],
  "events": []
};

app.get('/wallet/:address', async (req, res) => {
  const { address } = req.params;

  try {
    // Validate Ethereum address
    if (!web3.utils.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }

    // Ethereum: Get wallet balance
    const ethBalance = await web3.eth.getBalance(address);
    const ethBalanceInEth = web3.utils.fromWei(ethBalance, 'ether');

    // Ethereum: Get wallet transaction count
    const transactionCount = await web3.eth.getTransactionCount(address);

    // Free TON: Example interaction with a smart contract
    const contractAddress = '0:YOUR_CONTRACT_ADDRESS'; // Replace with actual contract address

    // Load the contract
    const contract = new tonClient.contracts.Contract(contractAbi, contractAddress);

    // Call a method on the contract (example: getBalance)
    const tonBalanceResponse = await contract.runLocal('getBalance', {});
    const tonBalance = tonBalanceResponse.decoded.output.balance;

    // Respond with wallet information
    res.json({
      address,
      ethBalance: ethBalanceInEth,
      transactionCount,
      tonBalance,
    });
  } catch (error) {
    if (error.message.includes('Invalid JSON RPC response')) {
      console.error('Error connecting to Ethereum node:', error.message);
      return res.status(500).json({ error: 'Error connecting to Ethereum node' });
    }

    if (error.message.includes('Network request failed')) {
      console.error('Error connecting to Free TON node:', error.message);
      return res.status(500).json({ error: 'Error connecting to Free TON node' });
    }

    console.error('Unexpected error:', error.message);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
