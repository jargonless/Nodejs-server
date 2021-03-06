const request = require('supertest')
const { Genre } = require('../../routes/genres')
const { User } = require('../../models/user')
const mongoose = require('mongoose')


describe('/api/genres', () => {
    let server
    
    beforeEach(async () => {
        server = require('../../index')
    })

    afterEach(async () => {
        await Genre.deleteMany({})
        await server.close()
    })

    describe('GET /', () => {
        it('should return all genres', async () => {
            const genres = [
                { name: 'genre1' },
                { name: 'genre2' },
              ]
            await Genre.collection.insertMany(genres)

            const res = await request(server).get('/api/genres')

            expect(res.status).toBe(200)
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy()
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy()
        })
    })

    describe('GET /:id', () => {

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/genres/1')
            expect(res.status).toBe(404)
        })
        
        it('should return a genre that has the given valid id', async () => {
            const genre = new Genre({ name: 'genre1' })
            await genre.save()

            const res = await request(server).get(`/api/genres/${genre._id}`)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('name', genre.name)
        })
    })

    describe('POST /', () => {
        
        const exec = function (token) {
            return request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name: 'genre1' })
        }

        it('should return 401 if client is not logged in', async () => {
            const res = await exec('')
            expect(res.status).toBe(401)
        })

        it('should save the genre if it is valid', async () => {
            const token = new User().generateAuthToken()
            const res = await exec(token)
            const genre = await Genre.findOne({ 'name': 'genre1' })
            expect(res.text).toMatch(/success/)
            expect(genre).toHaveProperty('name', 'genre1')
        })

    })

    describe('PUT /:id', () => {
        let genre, token, genreId

        const exec = function (token, id) {
            return request(server)
                .put(`/api/genres/${id}`)
                .set('x-auth-token', token)
                .send({ name: 'genreX' })
        }

        beforeEach(async () => {
            //create genre and assign token
            token = new User().generateAuthToken()
            genre = new Genre({ name: 'genre1' })
            await genre.save()
            genreId = genre._id
        })

        it('should return 401 if client is not logged in', async () => {
            const res = await exec('', genreId)
            expect(res.status).toBe(401)
        })

        it('should return 404 if genre is not found', async () => {
            const res = await exec(token, mongoose.Types.ObjectId().toHexString())
            expect(res.status).toBe(404)
        })

        it('should update genre if input is valid', async () => {
            const res = await exec(token, genre._id)

            genre = await Genre.findById(genre._id)
            expect(res.status).toBe(200)
            expect(genre.name).toEqual('genreX')
        })
    })

    describe('DELETE /:id', () => {
        let genre, token, genreId

        const exec = function (token, id) {
            return request(server)
                .delete(`/api/genres/${id}`)
                .set('x-auth-token', token)
                .send({ name: 'genreX' })
        }

        beforeEach(async () => {
            //create genre and assign token
            token = new User().generateAuthToken()
            genre = new Genre({ name: 'genre1' })
            await genre.save()
            genreId = genre._id
        })

        it('should return 401 if client is not logged in', async () => {
            const res = await exec('', genreId)
            expect(res.status).toBe(401)
        })

        it('should return 404 if genre is not found', async () => {
            const res = await exec(token, mongoose.Types.ObjectId().toHexString())
            expect(res.status).toBe(404)
        })

        it('should update genre if input is valid', async () => {
            await exec(token, genreId)

            genre = await Genre.findById(genreId)
            expect(genre).toBeNull()
        })
    })
})


