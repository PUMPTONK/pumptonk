// server.js
const express = require('express');
const db = require('./db');
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to get the latest token details
app.get('/latest-token', (req, res) => {
  const query = 'SELECT * FROM tokens ORDER BY created_at DESC LIMIT 1';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching latest token:', err.stack);
      return res.status(500).json({ error: 'Error fetching latest token' });
    }
    
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ error: 'No tokens found' });
    }
  });
});

// Endpoint to get the sum of currentSupply for a given user_id
app.get('/current-supply-sum/:userId', (req, res) => {
  const userId = req.params.userId;
  const query = 'SELECT SUM(currentSupply) AS totalCurrentSupply FROM tokens WHERE user_id = ?';
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching current supply sum:', err.stack);
      return res.status(500).json({ error: 'Error fetching current supply sum' });
    }
    
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ error: 'No tokens found for the given user ID' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
