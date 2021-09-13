const request = require('supertest')
const app = require('../index')
const config = require('../config.json')

/* This tests whether the verification of the user is functional and correct,
/  this is to avoid placing the same code in all tests */ 
describe('PATCH PATCH /api/tweets/:id', () => {
    describe('when user is not authenticated', () => {
        test('respond with 403 and error stating user is not authenticated', async () => {
            const response = await request(app).patch(`/api/tweets/${config.sampleTweetId}`).send({
                content: 'Update tweet'
            })
            expect(response.statusCode).toBe(403)
            expect(response.body.error).toBe('User not authenticated')
        })
    })

    describe('when user is authenticated but the token is invalid', () => {
        test('respond with 401 and error stating token is invalid', async () => {
            const response = await request(app).patch(`/api/tweets/${config.sampleTweetId}`).set('Cookie', ['jwt=invalid-token']).send({
                content: 'Update Tweet'
            })
            expect(response.statusCode).toBe(401)
            expect(response.body.error).toBe('Invalid access token')
        })
    })
})
    