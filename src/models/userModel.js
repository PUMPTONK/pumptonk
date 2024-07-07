// src/models/userModel.js
const db = require('../config/db');

class UserModel {
  static async updateUser(walletAddress, name, description, profilePicture) {
    const [result] = await db.execute(
      `INSERT INTO users (walletAddress, name, description, profilePicture) VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), profilePicture = VALUES(profilePicture)`,
      [walletAddress, name, description, profilePicture]
    );
    return result;
  }

  static async getUserByWalletAddress(walletAddress) {
    const [rows] = await db.execute('SELECT * FROM users WHERE walletAddress = ?', [walletAddress]);
    return rows[0];
  }
}

module.exports = UserModel;
