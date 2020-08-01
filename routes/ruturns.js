const express = require('express')
const moment = require('moment')
const auth = require('../middleWare/auth')
const router = express.Router()
const mongoose = require('mongoose')
const { Rental } = require('../models/rental')
const { Movie } = require('./movies')

router.post('/', auth, async (req, res) => {

    if (!req.body.customerId) return res.status(400).send('cutomer id not provided')
    if (!req.body.movieId) return res.status(400).send('movie id not provided')

    const rental = await Rental.findOne({ 'movie._id': req.body.movieId, 'customer._id': req.body.customerId })
    if (!rental) return res.status(404).send('Rental not found')
    if (rental.dateReturned) return res.status(400).send('This rental is already returned')


    rental.dateReturned = new Date(),
        rental.rentalFee = moment().diff(rental.dateOut, 'days') * rental.movie.dailyRentalRate
    await rental.save()

    await Movie.update({ _id: rental.movie._id }, { $inc: { numberInStock: 1 } })
    res.status(200).send(rental)
})

module.exports = router