const { User } = require('../models/user')
const config = require('config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const _ = require('lodash')
const express = require('express')
const router = express.Router()

// router.get('/', async (req, res) => {
// })

router.post('/', async (req, res) => {

    let user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send('Invalid email or password')

    //should never hard code this signature in source code
    const token = jwt.sign({_id: user._id}, config.get('jwtPrivateToken'))

    bcrypt
        .compare(req.body.password, user.password)
        .then(r => res.send(token))
        .catch(err => { res.status(400).send('Invalid email or password'); console.error(err) })
})


module.exports = router