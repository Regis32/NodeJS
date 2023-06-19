const sequelize = require('sequelize');

const database = new sequelize({
    dialect: 'sqlite',
    Storage: './database/storage/database.sqlite'
});

module.exports = database;