const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { genreSchema, Genre } = require('./genres')

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
        max: 100
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 10
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

router.get('/', (req, res) => {
    Movie.find().then(r => res.send(r)).catch(err => console.error(err))
})

router.post('/', async (req, res) => {

    const genre = await Genre.findById(req.body.genreID)
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

    await movie.save();
    res.send(movie);
})

router.put('/:id', async (req, res) => {
    const genre = await Genre.findById(req.body.genreID)
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
    res.send('movie updated')
})

router.delete('/:id', async (req, res) => {
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