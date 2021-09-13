const request = require('supertest')
const app = require('../index')

// Test the registration process
describe('POST /api/users/register', () => {
    describe('when username and password are provided', () => {
        test('respond with 201 and username', async () => {
            const response = await request(app).post('/api/users/register').send({
                username: 'newUser',
                password: 'password'
            })
            expect(response.statusCode).toBe(201)
            expect(response.body.username).toBe('newUser')
        })
    })

    describe('when username is not provided', () => {
        test('respond with 422 and error message stating to provide a username', async () => {
            const response = await request(app).post('/api/users/register').send({
                username: '',
                password: 'password'
            })
            expect(response.statusCode).toBe(422)
            expect(response.body.error).toBe('Please provide a username')
        })
    })

    describe('when password is not provided', () => {
        test('respond with 422 and error message stating to provide a password', async () => {
            const response = await request(app).post('/api/users/register').send({
                username: 'newUser',
                password: ''
            })
            expect(response.statusCode).toBe(422)
            expect(response.body.error).toBe('Please provide a password')
        })
    })

    describe('when username already exists', () => {
        test('respond with 409 and error message stating username exists', async () => {
            const response = await request(app).post('/api/users/register').send({
                username: 'tango',
                password: 'password'
            })
            expect(response.statusCode).toBe(409)
            expect(response.body.error).toBe('Username already exists')
        })
    })
})
