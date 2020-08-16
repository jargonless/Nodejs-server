const express = require('express')
const app = express()
const config = require('config')

require('./startup/logging')()
require('./startup/cors')(app)
require('./startup/routes')(app)
require('./startup/db')()
require('./startup/config')()
require('./startup/prod')(app)

const port = process.env.PORT || config.get("port")
const server = app.listen(port, () => {
    console.log(`listening on ${port}`)
})

module.exports = server