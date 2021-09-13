const request = require('supertest')
const app = require('../index')
const config = require('../config.json')

describe('PATCH /api/tweets/:id', () => {
    describe('when user is authenticated', () => {
        describe('when user is not authorized to update the tweet', () => {
            test('respond with 403 and error stating user has no access to resource', async () => {
                const response = await request(app).patch(`/api/tweets/${config.sampleTweetId}`).set('Cookie', [`jwt=${config.invalidToken}`])
                .send({
                    content: 'Updated Tweet'
                })
                expect(response.statusCode).toBe(403)
                expect(response.body.error).toBe('Unauthorized access to resource')
            })
        })
        describe('when tweet does not exist', () => {
            test('respond with 404 and error stating tweet does not exist', async () => {
                const response = await request(app).patch(`/api/tweets/${config.invalidTweetId}`).set('Cookie', [`jwt=${config.sampleToken}`])
                .send({
                    content: 'Updated Tweet'
                })
                expect(response.statusCode).toBe(404)
                expect(response.body.error).toBe('Tweet does not exist')
            })
        })
        describe('when content field is empty', () => {
            test('respond with 422 and error stating inability to update tweet', async () => {
                const response = await request(app).patch(`/api/tweets/${config.sampleTweetId}`).set('Cookie', [`jwt=${config.sampleToken}`])
                .send({
                    content: ''
                })
                expect(response.statusCode).toBe(422)
                expect(response.body.error).toBe('Cannot update tweet with empty content')
            })
        })
        describe('when content field is not empty', () => {
            test('respond with 200, success message and updated tweet object', async () => {
                const response = await request(app).patch(`/api/tweets/${config.sampleTweetId}`).set('Cookie', [`jwt=${config.sampleToken}`])
                .send({
                    content: 'Updated Sample Tweet'
                })
                expect(response.statusCode).toBe(200)
                expect(response.body.message).toBe('Tweet successfully updated')
                expect(response.body.tweet).toBeDefined()
                expect(response.body.tweet.content).toBe('Updated Sample Tweet')
            })
        })
    })
})