const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const customerSchema = {
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    isGold: {
        type: Boolean,
        default: false
    }
}

const Customer = mongoose.model('Customer', customerSchema)

router.get('/', (req, res) => {
    Customer.find().then(r => res.send(r)).catch(err => console.error(err))
})

router.post('/', (req, res) => {

    let newCustomer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    })
    newCustomer
        .save()
        .then(r => res.send(`Customer saved to database with success`))
        .catch(err => {
            console.error(err)
            res.status(400).send('Problem with customer format')
        })
})

router.put('/:id', async (req, res) => {

    let customer = await Customer.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold

        })
    if (!customer) return res.status(400).send('Customer not found')
    res.send('Customer updated')
})

router.delete('/:id', async (req, res) => {
    let customer = await Customer.findByIdAndDelete(req.params.id)
    if (!customer) return res.status(400).send('Customer not found')
    res.send('Customer deleted')
})

router.get('/:id', async (req, res) => {
    let customer = await Customer.findById(req.params.id)
    if (!customer) return res.status(400).send('Customer not found')
    res.send(customer)
})

module.exports = router
module.exports.Customer = Customer
module.exports.customerSchema = customerSchema