const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('caregiving', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres',
})

module.exports = sequelize