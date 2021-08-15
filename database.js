const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('db', 'admin', '12345678', {
    dialect: 'sqlite',
    host: './dev.sqlite',
})

module.exports = sequelize;