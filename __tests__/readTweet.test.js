const request = require('supertest')
const app = require('../index')
const config = require('../config.json')

describe('GET /api/tweets/:tweetId', () => {
    describe('when tweet exists', () => {
        test('respond with 200, success message and the tweet object', async () => {
            const response = await request(app).get(`/api/tweets/${config.sampleTweetId}`)
            expect(response.statusCode).toBe(200)
            expect(response.body.message).toBe('Tweet successfully retreived')
            expect(response.body.tweet).toBeDefined()
        })
    })

    describe('when tweet does not exist', () => {
        test('respond with 404 and error stating tweet does not exist', async () => {
            const response = await request(app).get(`/api/tweets/${config.invalidTweetId}`)
            expect(response.statusCode).toBe(404)
            expect(response.body.error).toBe('Tweet does not exist')
            expect(response.body.tweet).toBeUndefined()
        })
    })
})

