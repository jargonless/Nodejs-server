const winston = require('winston')
const mongoose = require('mongoose')
const config = require('config')

module.exports = function () {

    const db = config.get('db')
    mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
        .then(() => console.log(`Connection to ${db} with success`)).catch(err => console.error(err))
}