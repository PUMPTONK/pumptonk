const express = require('express');
const {
  createToken,
  likeToken,
  buyToken,
  sellToken,
  supplyToken,
  getToken,
  searchTokens
} = require('../controllers/tokenController');
const router = express.Router();

// Route to create a new token
router.post('/tokens', createToken);

// Route to like a token
router.post('/tokens/:id/like', likeToken);

// Route to buy a token
router.post('/tokens/:id/buy', buyToken);

// Route to sell a token
router.post('/tokens/:id/sell', sellToken);

// Route to supply a token
router.post('/tokens/:id/supply', supplyToken);

// Route to get a token by id
router.get('/tokens/:id', getToken);

// Route to search tokens
router.get('/tokens', searchTokens);

module.exports = router;
