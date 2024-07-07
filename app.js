// app.js

const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const walletRoutes = require('./routes/walletRoutes');

dotenv.config();

const app = express();
app.use(express.json());

// Serve static files (including the tonconnect-manifest.json)
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/wallet', walletRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
