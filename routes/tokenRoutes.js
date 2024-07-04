const express = require('express');
const router = express.Router();
const { retrieveTokens, createToken, likeToken, purchaseToken } = require('../controllers/tokenController');

router.post('/retrieve-tokens', retrieveTokens);
router.post('/create-token', createToken);
router.post('/like-token', likeToken);
router.post('/purchase-token', purchaseToken);

module.exports = router;
