const { TonClient } = require('@tonclient/core');
const { libNode } = require('@tonclient/lib-node');
TonClient.useBinaryLibrary(libNode);

let client;

try {
  client = new TonClient({
    network: {
      endpoints: ['https://main.ton.dev'],
    },
  });
  console.log('Connected to Free TON network');
} catch (error) {
  console.error('Error initializing Free TON client:', error.message);
  process.exit(1); // Exit the process if unable to connect
}

module.exports = client;
