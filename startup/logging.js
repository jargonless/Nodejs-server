const winston = require('winston')
require('express-async-errors')

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console()
    ]
})

module.exports = function () {
    winston.exceptions.handle(
        new winston.transports.Console({ colorize: true, prettyPrint: true }))

    process.on('unhandledRejection', ex => {
        throw ex
    })
}

module.exports.logger = logger