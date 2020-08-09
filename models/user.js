const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const config = require('config')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true,
        minlength: 5,
        maxlength:200
    },
    isAdmin:Boolean,
    roles:[],
    operations:[]
})

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateToken'))
    return token
}

const User = mongoose.model('User', userSchema)

module.exports.userSchema = this.userSchema
module.exports.User = User