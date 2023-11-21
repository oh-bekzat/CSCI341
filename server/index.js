const express = require('express')
const cors = require('cors')
const app = express()
const sequelize = require('./database')
app.use(express.json())
app.use(express.static('build'))
app.use(cors())

const usersRouter = require('./controllers/users')
const jobsRouter = require('./controllers/jobs')

app.use('/users', usersRouter)
app.use('/jobs', jobsRouter)

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