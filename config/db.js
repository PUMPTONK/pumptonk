const mysql = require('mysql2/promise');

const connectToDatabase = async () => {
    const connection = await mysql.createConnection({
        host: 'localhost', // Update with your database host
        user: 'root', // Update with your database user
        password: '', // Update with your database password
        database: 'ton_wallet' // Update with your database name
    });

    return connection;
};

module.exports = { connectToDatabase };
