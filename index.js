const express = require('express')
const app = express()
const config = require('config')

require('./startup/cors')(app)
require('./startup/config')()
require('./startup/db')()
require('./startup/logging')()
require('./startup/routes')(app)
require('./startup/prod')(app)

console.log(`NODE_ENV: ${app.get('env')}`)

const port = process.env.PORT || config.get("port")
const server = app.listen(port, () => {
    console.log(`listening on ${port}`)
})

module.exports = server