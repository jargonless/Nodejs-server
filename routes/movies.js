const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const auth = require('../middleWare/auth')
const { genreSchema, Genre } = require('./genres')
const moment = require('moment')
const admin = require('../middleWare/admin')
mongoose.set('useFindAndModify', false)

const movieSchema = {
    title: {
        type: String,
        required: true,
        trim: true,
        max: 255,
        min: 5
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 1000
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    description: {

    },
    publishDate: {
        type: Date,
        default: Date.now
    },
    liked: {
        type: Boolean,
        default: false
    }
}

const Movie = mongoose.model('Movie', movieSchema)

router.get('/', async (req, res) => {
    const movies = await Movie.find()
    res.send(movies)
})

router.post('/', [auth, admin], async (req, res) => {

    const genre = await Genre.findById(req.body.genre._id)
    if (!genre) return res.status(400).send('Could not find genreID in the database')

    let newMovie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        publishDate: moment().toJSON()
    })

    await newMovie.save();
    res.send(newMovie);
})

router.put('/:id', [auth, admin], async (req, res) => {
    const genre = await Genre.findById(req.body.genre._id)
    if (!genre) return res.status(400).send('Could not find genreID in the database')

    const movie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
          title: req.body.title,
          genre: {
            _id: genre._id,
            name: genre.name
          },
          numberInStock: req.body.numberInStock,
          dailyRentalRate: req.body.dailyRentalRate
        },
        { new: true }
      )

    if (!movie) return res.status(400).send('Movie not found')
    await movie.save()
    res.send('movie updated')
})

router.delete('/:id', [auth, admin], async (req, res) => {
    let movie = await Movie.findByIdAndDelete(req.params.id)
    if (!movie) return res.status(400).send('Movie not found')
    res.send('movie deleted')
})

router.get('/:id', async (req, res) => {
    let movie = await Movie.findById(req.params.id)
    if (!movie) return res.status(400).send('Movie not found')
    res.send(movie)
})

module.exports = router
module.exports.Movie = Movie