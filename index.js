const express = require('express');
const bodyParser = require('body-parser');

const { connectWallet } = require('./controllers/walletController');
const { createToken, likeToken } = require('./controllers/tokenController');

const app = express();
const port = 3003;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/connect-wallet', connectWallet);
app.post('/create-token', createToken);
app.post('/like-token', likeToken);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
