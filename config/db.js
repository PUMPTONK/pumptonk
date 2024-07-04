const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ton_db'
};

const connectToDatabase = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('MySQL connected...');
    return connection;
  } catch (error) {
    console.error('MySQL connection failed:', error);
    process.exit(1);
  }
};

module.exports = { connectToDatabase };
