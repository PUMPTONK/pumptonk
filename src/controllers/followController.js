// src/controllers/followController.js
const followModel = require('../models/followModel');

const followController = {
  follow: async (req, res) => {
    try {
      const { follower_id, following_id } = req.body;
      await followModel.follow(follower_id, following_id);
      res.status(200).json({ message: 'Followed successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  unfollow: async (req, res) => {
    try {
      const { follower_id, following_id } = req.body;
      await followModel.unfollow(follower_id, following_id);
      res.status(200).json({ message: 'Unfollowed successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getFollowers: async (req, res) => {
    try {
      const { user_id } = req.params;
      const followers = await followModel.getFollowers(user_id);
      res.status(200).json(followers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getFollowing: async (req, res) => {
    try {
      const { user_id } = req.params;
      const following = await followModel.getFollowing(user_id);
      res.status(200).json(following);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getFollowerCount: async (req, res) => {
    try {
      const { user_id } = req.params;
      const count = await followModel.getFollowerCount(user_id);
      res.status(200).json({ followerCount: count });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = followController;
