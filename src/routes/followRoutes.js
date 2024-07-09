// src/routes/followRoutes.js
const express = require('express');
const followController = require('../controllers/followController');

const router = express.Router();

router.post('/follow', followController.follow);
router.post('/unfollow', followController.unfollow);
router.get('/followers/:user_id', followController.getFollowers);
router.get('/following/:user_id', followController.getFollowing);
router.get('/followers/count/:user_id', followController.getFollowerCount);

module.exports = router;
