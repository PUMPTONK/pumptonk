// server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const db = require('./db');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  console.log('New client connected');
  
  ws.on('message', message => {
    console.log(`Received message => ${message}`);
    if (message === 'getLatestToken') {
      getLatestTokenDetails(ws);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

function getLatestTokenDetails(ws) {
  const query = 'SELECT * FROM tokens ORDER BY created_at DESC LIMIT 1';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching latest token:', err.stack);
      ws.send(JSON.stringify({ error: 'Error fetching latest token' }));
      return;
    }
    
    if (results.length > 0) {
      ws.send(JSON.stringify(results[0]));
    } else {
      ws.send(JSON.stringify({ error: 'No tokens found' }));
    }
  });
}

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
