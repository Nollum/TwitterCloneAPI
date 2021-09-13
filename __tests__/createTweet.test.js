const request = require('supertest')
const app = require('../index')
const config = require('../config.json')

describe('POST /api/tweets', () => {
    describe('when user is authenticated', () => {
        describe('when content field is empty', () => {
            test('respond with 422 and error stating inability to post empty tweet', async () => {
                const response = await request(app).post('/api/tweets').set('Cookie', [`jwt=${config.sampleToken}`])
                .send({
                    content: ''
                })
                expect(response.statusCode).toBe(422)
                expect(response.body.error).toBe('Cannot post empty tweet')
            })
        })
        describe('when content field is not empty', () => {
            test('respond with 201, success message and tweet object', async () => {
                const response = await request(app).post('/api/tweets').set('Cookie', [`jwt=${config.sampleToken}`])
                .send({
                    content: 'To thine own self be true, and it must follow, as the night the day, thou canst not then be false to any man.'
                })
                expect(response.statusCode).toBe(201)
                expect(response.body.message).toBe('Tweet successfully created')
                expect(response.body.tweet).toBeDefined()
                expect(response.body.tweet.content).toBe('To thine own self be true, and it must follow, as the night the day, thou canst not then be false to any man.')
            })
        })
    })
})

