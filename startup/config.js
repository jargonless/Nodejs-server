const config = require('config')

module.exports = function(){
    if (!config.get('jwtPrivateToken')) {
        throw new Error('FATAL ERROR: jwtPrivateToken is not defined')
    }
}