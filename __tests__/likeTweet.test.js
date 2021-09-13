const request = require('supertest')
const app = require('../index')
const config = require('../config.json')

describe('PATCH /api/tweets/:tweetId/like', () => {
    describe('when tweet exists', () => {
        describe('when tweet has not yet been liked by the user', () => {
            test('respond with 200, message stating tweet has been liked and the liked tweet object', async () => {
                const response = await request(app).patch(`/api/tweets/${config.sampleTweetId}/like`).set('Cookie', [`jwt=${config.sampleToken}`]).send()
                expect(response.statusCode).toBe(200)
                expect(response.body.message).toBe('Tweet successfully liked')
                expect(response.body.tweet).toBeDefined()
            })
        })
        describe('when the tweet has already been liked by the user', () => {
            test('respond with 200, message stating tweet has been unliked and the liked tweet object', async () => {
                const response = await request(app).patch(`/api/tweets/${config.sampleTweetId}/like`).set('Cookie', [`jwt=${config.sampleToken}`]).send()
                expect(response.statusCode).toBe(200)
                expect(response.body.message).toBe('Tweet successfully unliked')
                expect(response.body.tweet).toBeDefined()
            })
        })
    })

    describe('when tweet does not exist', () => {
        test('respond with 404 and error stating tweet does not exist', async () => {
            const response = await request(app).patch(`/api/tweets/${config.invalidTweetId}/like`).set('Cookie', [`jwt=${config.sampleToken}`]).send()
            expect(response.statusCode).toBe(404)
            expect(response.body.error).toBe('Tweet does not exist')
        })
    })
})

