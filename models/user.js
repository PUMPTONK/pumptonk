const pool = require('../config/dbConfig');

const createUserTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
        id int(11) NOT NULL,
        walletAddress varchar(255) NOT NULL,
        name varchar(255) NOT NULL,
        description text DEFAULT NULL,
        profilePicture varchar(255) DEFAULT NULL,
        created_at timestamp NOT NULL DEFAULT current_timestamp(),
        updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
    )
  `);
};

createUserTable();

module.exports = pool;
