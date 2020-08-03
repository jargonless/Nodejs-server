const winston = require('winston')
require('express-async-errors')

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logfile.log' })
    ]
})

module.exports = function () {
    winston.exceptions.handle(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.File({ filename: 'uncaugthtExceptions.log' }))

    process.on('unhandledRejection', ex => {
        throw ex
    })

}

module.exports.logger = logger