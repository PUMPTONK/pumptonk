// src/app.js
const express = require('express');
const bodyParser = require('body-parser');
const followRoutes = require('./routes/followRoutes');

const app = express();

app.use(bodyParser.json());
app.use('/api', followRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
