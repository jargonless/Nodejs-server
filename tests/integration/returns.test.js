const { Rental } = require('../../models/rental')
const { User } = require('../../models/user')
const mongoose = require('mongoose')
const request = require('supertest')
const moment = require('moment')
const { Movie } = require('../../routes/movies')

describe('/api/returns', () => {
    let server, userId, movieId, rental, token, movie

    const exec = () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ movieId, userId })
    }

    beforeEach(async () => {
        server = require('../../index')
        userId = mongoose.Types.ObjectId().toHexString()
        movieId = mongoose.Types.ObjectId().toHexString()
        genreId = mongoose.Types.ObjectId().toHexString()
        token = new User().generateAuthToken()

        movie = new Movie({
            _id: movieId,
            title: 'movie-title',
            dailyRentalRate: 2,
            genre: {
                _id: genreId,
                name: '12345'
            },
            numberInStock: 10
        })

        rental = new Rental({
            user: {
                _id: userId
            },
            movie: {
                _id: movieId,
                title: 'movie-title',
                dailyRentalRate: 2,
                genre: {
                    _id: genreId,
                    name: '12345'
                }
            }
        })
        await rental.save()
        await movie.save()
    })

    afterEach(async () => {
        await server.close()
        await Rental.deleteMany({})
        await Movie.deleteMany({})
    })

    // it('should return 401 if client not logged in', async () => {
    //     token = ''
    //     const res = await exec()
    //     expect(res.status).toBe(401)
    // })

    // it('should return 400 if userId is not provided', async () => {
    //     userId = ''
    //     const res = await exec()
    //     expect(res.status).toBe(400)
    // })

    // it('should return 400 if movieId is not provided', async () => {
    //     movieId = ''
    //     const res = await exec()
    //     expect(res.status).toBe(400)
    // })

    // it('should return 404 if rental with given movieId and userId is not found', async () => {
    //     await Rental.deleteMany({})
    //     const res = await exec()
    //     expect(res.status).toBe(404)
    // })

    // it('should return 400 if return is already processed', async () => {
    //     rental.dateReturned = new Date()
    //     await rental.save()
    //     const res = await exec()
    //     expect(res.status).toBe(400)
    // })

    // it('should return 200 we get a valid request', async () => {
    //     const res = await exec()
    //     expect(res.status).toBe(200)
    // })

    // it('should set a return date if input is valid', async () => {
    //     const res = await exec()
    //     rental = await Rental.findById(rental._id)
    //     const diff = new Date() - rental.dateReturned
    //     expect(diff).toBeGreaterThanOrEqual(0)
    // })

    // it('should set valid rental fee', async () => {
    //     rental.dateOut = moment().add(-7, 'days').toDate()
    //     await rental.save()

    //     await exec()

    //     rental = await Rental.findById(rental._id)
    //     const rentalFee = 7 * rental.movie.dailyRentalRate
    //     expect(rental.rentalFee).toEqual(rentalFee)
    // })

    // it('should increase the movie in stock by 1', async () => {
    //     const res = await exec()
    //     movie = await Movie.findById(movie._id)
    //     expect(movie.numberInStock).toEqual(11)
    // })

    // it('should return rental in body', async () => {
    //     const res = await exec()
    //     expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee', 'user', 'movie']))
    // })

    it('should return true', async () => {
        expect(true).toBeTruthy()
    })

})