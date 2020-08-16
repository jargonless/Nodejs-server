const express = require('express')
const router = express.Router()
const { Movie } = require('./movies')
const { User } = require('../models/user')
const { Rental } = require('../models/rental')
const mongoose = require('mongoose')
const auth = require('../middleWare/auth')
mongoose.set('useFindAndModify', false)

router.get('/u/:id', async (req, res) => {
  const rentals = await Rental.find({ 'user': req.params.id }).sort('-dateOut')
  res.send(rentals)
})

router.post('/', async (req, res) => {
  const user = await User.findById(req.body.userId)
  if (!user) return res.status(400).send('Invalid user.')

  const movie = await Movie.findById(req.body.movieId)
  if (!movie) return res.status(400).send('Invalid movie.')

  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.')

  let rental = new Rental({
    user: {
      _id: user._id
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      genre: {
        _id: movie.genre._id,
        name: movie.genre.name
      }
    }
  })

  await rental.save()
  await Movie.findOneAndUpdate({ _id: movie._id }, { $inc: { numberInStock: -1 } })

  res.send('Rental saved with success')
})

router.delete('/:id', async (req, res) => {
  const rental = await Rental.findByIdAndDelete(req.params.id)
  if (!rental) return res.status(404).send('The rental with the given ID was not found.')

  const movie = await Movie.findById(rental.movie._id)
  movie.numberInStock += 1
  await movie.save()

  res.status(200).send('Rental deleted with success')
})

router.get('/:id', auth, async (req, res) => {
  const rental = await Rental.findById(req.params.id)
  if (!rental) return res.status(404).send('The rental with the given ID was not found.')

  res.send(rental)
})

module.exports = router
module.exports.Rental = Rental