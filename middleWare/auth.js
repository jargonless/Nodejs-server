const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function auth(req, res, next){
    if(!config.get('requireAuth')) return next()

    const token = req.header('x-auth-token')
    if(!token) res.status(401).send('Access denied. No token provided.')

    try{
        const decoded = jwt.verify(token, config.get('jwtPrivateToken'))
        req.user = decoded
        next()
    }

    catch(err){
        res.status(400).send('Invalid Token')
    }
}
