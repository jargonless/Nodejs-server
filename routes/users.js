const { User } = require('../models/user')
const auth = require('../middleWare/auth')
const bcrypt = require('bcrypt')
const _ = require('lodash')
const express = require('express')
const router = express.Router()

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(user._id).select('-password')
})

router.post('/', async (req, res) => {
    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send('User already registered')

    user = await new User(_.pick(req.body, ['name', 'email', 'password']))
    user.password = await bcrypt.hash(user.password, await bcrypt.genSalt(10))
    await user.save()
    const token = user.generateAuthToken()
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']))
})

module.exports = router