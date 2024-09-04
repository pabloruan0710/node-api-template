require('dotenv').config()
const listen = require('./process')
const express = require('express')
const morgan = require('morgan');
const logger = require('./utils/logger')

const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('tiny'))

// Carregar certificados SSL
const server = require('./ssl')(app)

// Inciializa Managers
const SocketManager = require('./sockets/SocketMananger')
SocketManager.initialize(server)

const PostgresSQLManager = require('../config/postgres')

const RethinkDBManager = require('../config/rethinkdb')
RethinkDBManager.initialize()


const RedisManager = require('../config/redis');
RedisManager.initialize()

// Middleware
const ErrorMiddleware = require('./middlewares/errorMiddleware');

// Routes
const routes = require('./routes').initialize(app)

// Inicia servidor na porta definida no .env 
server.listen(process.env.PORT, () => {
    logger.info(`Server started with port ${process.env.PORT}`)
    const RethinkDBManager2 = require('../config/rethinkdb')
})

app.get("*", ErrorMiddleware.error404, (req, res) => {
    next()
})
app.post("*", ErrorMiddleware.error404, (req, res) => {
    next()
})

module.exports = app