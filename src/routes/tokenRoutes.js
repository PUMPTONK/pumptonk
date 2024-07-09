// src/routes/tokenRoutes.js
const express = require('express');
const {
  getNewTokens,
  getTrendingTokens,
  getTotalTokens,
  getTotalInitialSupply,
  getTokensByUserId,
  getTotalTokensByUserId
} = require('../controllers/tokenController');

const router = express.Router();

router.get('/tokens/new', getNewTokens);
router.get('/tokens/trending', getTrendingTokens);
router.get('/tokens/total', getTotalTokens);
router.get('/tokens/total-supply', getTotalInitialSupply);
router.get('/tokens/user/:user_id', getTokensByUserId);
router.get('/tokens/total/:user_id', getTotalTokensByUserId);

module.exports = router;
