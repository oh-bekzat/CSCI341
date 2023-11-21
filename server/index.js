const express = require('express')
const app = express()
const sequelize = require('./database')

const usersRouter = require('./controllers/users')

app.use(express.json())

app.use('/users', usersRouter)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)

    sequelize.authenticate()
    .then(() => {
        console.log('Database connected.')
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err)
    })
})