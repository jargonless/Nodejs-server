const express = require('express')
const movieRouter = require('../routes/movies')
const genreRouter = require('../routes/genres')
const rentalRouter = require('../routes/rentals')
const userRouter = require('../routes/users')
const authRouter = require('../routes/auth')
const returnRouter = require('../routes/ruturns')
const errorHandle = require('../middleWare/error')

module.exports = function (app) {
    app.use(express.json())
    app.use('/api/movies', movieRouter)
    app.use('/api/genres', genreRouter)
    app.use('/api/rentals', rentalRouter)
    app.use('/api/users', userRouter)
    app.use('/api/auth', authRouter)
    app.use('/api/returns', returnRouter)

    //the following error handler is registered after all the router middle ware functions, so we can access it using the "next" key word 
    app.use(errorHandle)
}