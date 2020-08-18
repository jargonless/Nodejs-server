const mongoose = require('mongoose')
const config = require('config')

module.exports = function () {

    const db = config.get('db')
    mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }).then(() => console.log(`Connection to MongoDB`)).catch(err => console.error(err))
}