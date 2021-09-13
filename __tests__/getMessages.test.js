const request = require('supertest')
const app = require('../index')
const config = require('../config.json')

describe('GET /api/chats/:chatId/messages', () => {
    describe('when user is authenticated', () => {
        describe('when chat exists', () => {
            test('respond with 200, success message, chat object and the messages objects', async () => {
                const response = await request(app).get(`/api/chats/${config.sampleChatId}/messages`).set('Cookie', [`jwt=${config.sampleToken}`]).send()
                expect(response.statusCode).toBe(200)
                expect(response.body.message).toBe('Chat successfully retreived')
                expect(response.body.chat).toBeDefined()
                expect(response.body.chatMessages).toBeDefined()
            })
        })
        describe('when chat does not exist or user is not part of it', () => {
            test('respond with 404 and error stating chat does not exist', async () => {
                const response = await request(app).get(`/api/chats/${config.invalidChatId}/messages`).set('Cookie', [`jwt=${config.sampleToken}`]).send()
                expect(response.statusCode).toBe(404)
                expect(response.body.error).toBe('Chat does not exist')
                expect(response.body.chat).toBeUndefined()
                expect(response.body.chatMessages).toBeUndefined()
            })
        })
    })
})