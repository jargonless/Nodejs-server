const auth = require('../middleWare/auth')
const admin = require('../middleWare/admin')
const validateObjectId = require('../middleWare/validateObjectID')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const genreSchema = {
    name: {
        type: String,
        required: true
    }
}

const Genre = mongoose.model('Genre', genreSchema)

router.get('/', async (req, res) => {
    const genres = await Genre.find()
    res.send(genres)
})

router.post('/', auth, (req, res) => {
    let newGenre = new Genre({
        name: req.body.name
    })
    newGenre
        .save()
        .then(r => {
            res.send('Genre saved to database with success')
        })
        .catch(err => {
            console.error(err)
            res.status(400).send('Problem with Genre format')
        })
})

router.put('/:id', auth, async (req, res) => {

    let genre = await Genre.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
    })
    if (!genre) return res.status(404).send('Genre not found')
    res.send('Genre updated')
})

router.delete('/:id', [auth, admin], async (req, res) => {
    let genre = await Genre.findByIdAndDelete(req.params.id)
    if (!genre) return res.status(404).send('Genre not found')
    res.send('Genre deleted')
})

router.get('/:id', validateObjectId, async (req, res, next) => {
    const genre = await Genre.findById(req.params.id)
    if (!genre) return res.status(404).send('The genre with given ID does not exist')

    res.send(genre)
})

module.exports = router
module.exports.genreSchema = genreSchema
module.exports.Genre = Genre