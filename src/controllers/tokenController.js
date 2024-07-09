// src/controllers/tokenController.js
const connection = require('../db/connection');

const getNewTokens = (req, res) => {
  const query = 'SELECT * FROM tokens ORDER BY created_at DESC';
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

const getTrendingTokens = (req, res) => {
  const query = 'SELECT * FROM tokens ORDER BY initial_supply DESC';
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

const getTotalTokens = (req, res) => {
  const query = 'SELECT COUNT(*) AS total_tokens FROM tokens';
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
};

const getTotalInitialSupply = (req, res) => {
  const query = 'SELECT SUM(initial_supply) AS total_initial_supply FROM tokens';
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
};

const getTokensByUserId = (req, res) => {
  const { user_id } = req.params;
  const query = 'SELECT * FROM tokens WHERE user_id = ?';
  connection.query(query, [user_id], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};


const getTotalTokensByUserId = (req, res) => {
  const { user_id } = req.params;
  const query = 'SELECT COUNT(*) AS total_tokens FROM tokens WHERE user_id = ?';
  connection.query(query, [user_id], (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
};


module.exports = {
  getNewTokens,
  getTrendingTokens,
  getTotalTokens,
  getTotalInitialSupply,
  getTokensByUserId,
  getTotalTokensByUserId
};
