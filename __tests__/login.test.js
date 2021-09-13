const request = require('supertest')
const app = require('../index')

// Test the login process
describe('POST /api/users/login', () => {
    describe('when username and password are provided', () => {
        describe('when username and password are correct', () => {
            test('respond with 200, username and access token', async () => {
                const response = await request(app).post('/api/users/login').send({
                    username: 'tango',
                    password: 'password'
                })
                expect(response.statusCode).toBe(200)
                expect(response.body.username).toBe('tango')
                expect(response.body.token).toBeDefined()
            })
        })

        describe('when username does not exist', () => {
            test('respond with 404 and error message stating username does not exist', async () => {
                const response = await request(app).post('/api/users/login').send({
                    username: 'void',
                    password: 'password'
                })
                expect(response.statusCode).toBe(404)
                expect(response.body.error).toBe('User does not exist')
            })
        })

        describe('when password is incorrect', () => {
            test('respond with 401 and error message stating password is incorrect', async () => {
                const response = await request(app).post('/api/users/login').send({
                    username: 'tango',
                    password: 'wrong-password'
                })
                expect(response.statusCode).toBe(401)
                expect(response.body.error).toBe('Incorrect password')
            })
        })
    })

    describe('when username is not provided', () => {
        test('respond with 422 and error message asking to provide a username', async () => {
            const response = await request(app).post('/api/users/login').send({
                username: '',
                password: 'password'
            })
            expect(response.statusCode).toBe(422)
            expect(response.body.error).toBe('Please provide a username')
        })
    })

    describe('when password is not provided', () => {
        test('respond with 422 and error message asking to provide a password', async () => {
            const response = await request(app).post('/api/users/login').send({
                username: 'tango',
                password: ''
            })
            expect(response.statusCode).toBe(422)
            expect(response.body.error).toBe('Please provide a password')
        })
    })
})