const request = require('supertest')
const {User} = require('../../models/user');


describe('auth middleware', () => {
    let server, token
    const exec = () => {
        return request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name: 'genre1' })
    }

    beforeEach(async () => { 
        token = new User().generateAuthToken()
        server = require('../../index') 
    })

    afterEach(async () => { await server.close() })

    it('should return 401 if token is not provided', async () => {
        token = ''
        const res = await exec()
        expect(res.status).toBe(401)
    })
})