const request = require('supertest')
const app = require('../index')
const config = require('../config.json')

describe('DELETE /api/tweets/:id', () => {
    describe('when user is authenticated', () => {
        describe('when user is not authorized to update the tweet', () => {
            test('respond with 403 and error stating user has no access to resource', async () => {
                const response = await request(app).delete(`/api/tweets/${config.sampleTweetId}`).set('Cookie', [`jwt=${config.invalidToken}`]).send()
                expect(response.statusCode).toBe(403)
                expect(response.body.error).toBe('Unauthorized access to resource')
            })
        })
        describe('when tweet does not exist', () => {
            test('respond with 404 and error stating tweet does not exist', async () => {
                const response = await request(app).delete(`/api/tweets/${config.invalidTweetId}`).set('Cookie', [`jwt=${config.sampleToken}`]).send()
                expect(response.statusCode).toBe(404)
                expect(response.body.error).toBe('Tweet does not exist')
            })
        })

        describe('when tweet does exist', () => {
            test('respond with 200, success message and the tweet object', async () => {
                // Send a request to create a new tweet
                const createResponse = await request(app).post('/api/tweets').set('Cookie', [`jwt=${config.sampleToken}`])
                .send({
                    content: 'This tweet will be deleted'
                })
                // Send request to delete the newly created tweet
                const response = await request(app).delete(`/api/tweets/${createResponse.body.tweet._id}`).set('Cookie', [`jwt=${config.sampleToken}`]).send()
                expect(response.statusCode).toBe(200)
                expect(response.body.message).toBe('Tweet successfully deleted')
                expect(response.body.tweet).toBeDefined()
            })
        })
        
    })
})