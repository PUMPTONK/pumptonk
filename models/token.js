const pool = require('../config/dbConfig');

const createTokenTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tokens (
      id int(11) NOT NULL,
      user_id float NOT NULL,
      name varchar(255) NOT NULL,
      symbol varchar(255) NOT NULL,
      description text DEFAULT NULL,
      token_image text DEFAULT NULL,
      initial_supply decimal(18,8) NOT NULL,
      twitter_link text DEFAULT NULL,
      telegram_link text DEFAULT NULL,
      website_link text DEFAULT NULL,
      user_wallet_address varchar(255) NOT NULL,
      allocated_to_user_wallet varchar(255) NOT NULL,
      allocated_to_market_maker_wallet varchar(255) NOT NULL,
      allocated_to_exchange_wallets varchar(255) NOT NULL,
      created_at timestamp NOT NULL DEFAULT current_timestamp(),
      marketCap decimal(18,2) DEFAULT NULL,
      currentSupply int(11) DEFAULT NULL,
      transaction_hash varchar(255) DEFAULT NULL,
      bondingCurvePrice float NOT NULL
    )
  `);
};

createTokenTable();

module.exports = pool;
