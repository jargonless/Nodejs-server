const { logger } = require('../startup/logging')

//this is only called within express context (in request processing pipeline), which means on root files (server/index/js), it's not involved, which is why we need to handle uncaught exceptions in root file
module.exports = function(err, req, res, next){
    logger.error(err.message, err)
    res.status(500).send('Something happened during connection')
}