const mongoose = require('mongoose')
const request = require('supertest')
const { Movie } = require('../../routes/movies')
const { Genre } = require('../../routes/genres')
const { User } = require('../../models/user')

describe('api/movies', () => {
    let server, movieId, genreId, movie, genre, token, randomId

    beforeEach(async () => {
        server = require('../../index')
        token = new User().generateAuthToken()
        movieId = mongoose.Types.ObjectId().toHexString()
        genreId = mongoose.Types.ObjectId().toHexString()
        randomId = mongoose.Types.ObjectId().toHexString()

        genre = await new Genre({
            _id: genreId,
            name: 'Action'
        })
        await genre.save()

        movie = await new Movie({
            _id: movieId,
            title: 'movie1',
            genre: {
                _id: genreId,
                name: 'Action'
            },
            numberInStock: 5,
            dailyRentalRate: 5
        })

        await movie.save()
    })

    afterEach(async () => {
        await server.close()
        await Movie.deleteMany({})
        await Genre.deleteMany({})
    })

    describe('GET /', () => {
        it('should return all movies', async () => {
            const res = await request(server).get('/api/movies')
            expect(res.body.some(g => g.title === 'movie1')).toBeTruthy()
            expect(res.body.some(g => g.numberInStock === 5)).toBeTruthy()
            expect(res.body.some(g => g.dailyRentalRate === 5)).toBeTruthy()
            expect(res.body.some(g => g.genre.name === 'Action')).toBeTruthy()
            expect(res.body.length).toBe(1)
        })
    })

    describe('POST /', () => {
        const newMovieId = mongoose.Types.ObjectId().toHexString()
        const createMovie = function () {
            return new Movie({
                _id: newMovieId,
                title: 'movie2',
                genre: {
                    _id: genreId,
                    name: 'Action'
                },
                numberInStock: 6,
                dailyRentalRate: 6
            })
        }
        const exec = function (movie) {
            return request(server)
                .post('/api/movies')
                .set('x-auth-token', token)
                .send(movie)
        }

        it('should return 400 if genreId cannot be found', async () => {
            const newMovie = await createMovie()
            newMovie.genre._id = randomId
            const res = await exec(newMovie)

            expect(res.status).toBe(400)
        })

        it('should add movie into database', async () => {
            const newMovie = await createMovie()
            await newMovie.save()
            await exec(newMovie)

            const oneMovie = await Movie.findById(newMovieId)

            expect(oneMovie).toHaveProperty('title', 'movie2')
            expect(oneMovie).toHaveProperty('numberInStock', 6)
            expect(oneMovie).toHaveProperty('dailyRentalRate', 6)
            expect(oneMovie).toHaveProperty('genre.name', 'Action')
        })
    })

    describe('PUT /:id', () => {
        const execPut = function (movieId, movie) {
            return request(server)
                .put('/api/movies/' + movieId)
                .set('x-auth-token', token)
                .send(movie)
        }

        it('should return 400 if genreId cannot be found', async () => {
            let newMovie = movie
            newMovie.genre = {
                _id: randomId,
                name: 'genreX'
            }

            const res = await execPut(movieId, newMovie)

            expect(res.status).toBe(400)
        })

        it('should update the movie in the database', async () => {
            let newMovie = movie
            newMovie.set({
                title: 'Terminator',
                numberInStock: 16,
                dailyRentalRate: 10
            })
            await execPut(movieId, newMovie)
            const updatedMovie = await Movie.findById(movieId)

            expect(updatedMovie.title).toBe(newMovie.title)
            expect(updatedMovie.numberInStock).toBe(newMovie.numberInStock)
            expect(updatedMovie.dailyRentalRate).toBe(newMovie.dailyRentalRate)
        })

        it('should return code 400 if movie with given id cannot be found', async () => {
            const res = await execPut(randomId, movie)
            expect(res.status).toBe(400)
        })
    })

    describe('DELETE /:id', () => {
        const execDelete = function (movieId) {
            return request(server)
                .delete('/api/movies/' + movieId)
                .set('x-auth-token', token)
        }

        it('should return 400 if movie with given id cannot be found', async () => {
            const res = await execDelete(randomId)
            expect(res.status).toBe(400)
        })

        it('should delete movie from database', async () => {
            await execDelete(movieId)
            const movies = await Movie.findOne({})
            expect(movies).toBeNull()
        })
    })

    describe('GET /:id', () => {
        const execIdGet = function (movieId) {
            return request(server)
                .get('/api/movies/' + movieId)
                .set('x-auth-token', token)
        }

        it('should return 400 if movie with given id cannot be found', async () => {
            const res = await execIdGet(randomId)
            expect(res.status).toBe(400)
        })

        it('should delete movie from database', async () => {
            const res = await execIdGet(movieId)

            expect(res.body).toHaveProperty('title', 'movie1')
            expect(res.body).toHaveProperty('numberInStock', 5)
            expect(res.body).toHaveProperty('dailyRentalRate', 5)
            expect(res.body).toHaveProperty('genre.name', 'Action')
        })
    })
})