const {
    Sequelize
} = require('sequelize');

const db = new Sequelize('mydb', 'postgres', 'test123', {
    host: "localhost",
    dialect: 'postgres'
})

module.exports = db