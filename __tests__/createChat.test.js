const request = require('supertest')
const app = require('../index')
const config = require('../config.json')

describe('POST /api/chats', () => {
    describe('when user is authenticated', () => {
        describe('when \'users\' field is empty', () => {
            test('respond with 422 and error stating users not received', async () => {
                const response = await request(app).post('/api/chats').set('Cookie', [`jwt=${config.sampleToken}`]).send()
                expect(response.statusCode).toBe(422)
                expect(response.body.error).toBe('Users not received')
            })
        })
        describe('when \'users\' field contains users', () => {
            describe('when user(s) does not exist', () => {
                test('respond with 404 and error stating user does not exist', async () => {
                    const response = await request(app).post('/api/chats').set('Cookie', [`jwt=${config.sampleToken}`]).send({
                        users: [config.invalidUserId]
                    })
                    expect(response.statusCode).toBe(404)
                    expect(response.body.error).toBe('User(s) does not exist')
                })
            })
            describe('when user(s) exist', () => {
                test('respond with 201 and message stating chat has been created', async () => {
                    const response = await request(app).post('/api/chats').set('Cookie', [`jwt=${config.sampleToken}`]).send({
                        users: ["613cfdb658bb23b9a588b551"]
                    })
                    expect(response.statusCode).toBe(201)
                    expect(response.body.message).toBe('Chat successfully created')
                })
            })
        })
    })
})