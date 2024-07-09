// src/app.js
const express = require('express');
const tokenRoutes = require('./routes/tokenRoutes');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/api', tokenRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
