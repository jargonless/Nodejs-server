const winston = require('winston')
require('express-async-errors')
require('winston-mongodb')

const unCaughtErrorLogger = winston.createLogger({
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: 'uncaugthtExceptions.log', level: 'error' })
    ],
  });

const unhandledRejectionLogger = winston.createLogger({
    format: winston.format.json(),
    transports:[
        new winston.transports.File({ filename: 'unhandledRejection.log', level: 'error' })
    ]
})

module.exports = function () {

    winston.exceptions.handle(
        new winston.transports.Console({colorize: true, prettyPrint: true}),
        new winston.transports.File({ filename: 'uncaugthtExceptions.log' }))

    process.on('unhandledRejection', ex => {
        unhandledRejectionLogger.error(ex, ex.message)
        process.exit(1)
    })

    process.on('uncaughtException', ex => {
        unCaughtErrorLogger.error(ex.message, ex)
        process.exit(1)
    })

    winston.add(new winston.transports.File({ filename: 'logfile.log' }))
    winston.add(new winston.transports.MongoDB({ db: 'mongodb://localhost/jargonless', level: 'error' }))
 }