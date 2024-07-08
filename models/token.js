const pool = require('../config/dbConfig');

const createTokenTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tokens (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      symbol VARCHAR(255) NOT NULL,
      description TEXT,
      token_image TEXT,
      initial_supply DECIMAL(18, 8) NOT NULL,
      twitter_link TEXT,
      telegram_link TEXT,
      website_link TEXT,
      user_wallet_address VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

createTokenTable();

module.exports = pool;
