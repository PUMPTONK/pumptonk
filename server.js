// server.js
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/db');
const commentRoutes = require('./routes/commentsRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

app.use(bodyParser.json());
app.use('/api', commentRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

sequelize.sync()
  .then(() => {
    console.log('Database connected and synced');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });
