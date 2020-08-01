const winston = require('winston')

//this is only called within express context (in request processing pipeline), which means on root files (server/index/js), it's not involved, which is why we need to handle uncaught exceptions in root file
module.exports = function(err, req, res, next){
    winston.error(err, err.message)
    res.status(500).send('Something happened during connection')
}