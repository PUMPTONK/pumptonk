// config/db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('yciyc-tokens', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
