const mongoose = require('mongoose')
const { genreSchema } = require('../routes/genres')

const rentalSchema = {
    user: {
        type: mongoose.Types.ObjectId
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 5,
                maxlength: 255
            },
            dailyRentalRate: { 
                type: Number, 
                required: true,
                min: 0,
                max: 255
              },
            genre: {
                type: genreSchema
            }
        })
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateLimit: {
        
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
}

module.exports.Rental = mongoose.model('Rental', rentalSchema)