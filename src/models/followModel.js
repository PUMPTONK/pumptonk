// src/models/followModel.js
const db = require('./db');

const followModel = {
  follow: async (follower_id, following_id) => {
    const checkUserExists = async (user_id) => {
      const [rows] = await db.execute('SELECT id FROM users WHERE id = ?', [user_id]);
      return rows.length > 0;
    };

    const followerExists = await checkUserExists(follower_id);
    const followingExists = await checkUserExists(following_id);

    if (!followerExists || !followingExists) {
      throw new Error('One or both user IDs do not exist.');
    }

    const sql = 'INSERT INTO follows (follower_id, following_id) VALUES (?, ?)';
    await db.execute(sql, [follower_id, following_id]);
  },
  unfollow: async (follower_id, following_id) => {
    const sql = 'DELETE FROM follows WHERE follower_id = ? AND following_id = ?';
    await db.execute(sql, [follower_id, following_id]);
  },
  getFollowers: async (user_id) => {
    const sql = 'SELECT follower_id FROM follows WHERE following_id = ?';
    const [rows] = await db.execute(sql, [user_id]);
    return rows;
  },
  getFollowing: async (user_id) => {
    const sql = 'SELECT following_id FROM follows WHERE follower_id = ?';
    const [rows] = await db.execute(sql, [user_id]);
    return rows;
  }
};

module.exports = followModel;
