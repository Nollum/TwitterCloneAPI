const request = require('supertest')
const app = require('../index')
const config = require('../config.json')

describe('POST /api/chats/:chatId/messages', () => {
    describe('when user is authenticated', () => {
        describe('when message is empty', () => {
            test('respond with 422 and error stating inability to send empty message', async () => {
                const response = await request(app).post(`/api/chats/${config.sampleChatId}/messages`).set('Cookie', [`jwt=${config.sampleToken}`])
                .send({
                    content: ''
                })
                expect(response.statusCode).toBe(422)
                expect(response.body.error).toBe('Cannot send empty message')
            })
        })

        describe('when chat ID and content field are not empty', () => {
            describe('when chat does not exist', () => {
                test('respond with 404 and error stating chat does not exist', async () => {
                    const response = await request(app).post(`/api/chats/${config.invalidChatId}/messages`).set('Cookie', [`jwt=${config.sampleToken}`])
                    .send({
                        content: 'This is a message from tango'
                    })
                    expect(response.statusCode).toBe(404)
                    expect(response.body.error).toBe('Chat does not exist')
                })
            })
            describe('when chat exists', () => {
                describe('when user is unauthorized to send messages to the chat', () => {
                    test('respond with 403 and error stating that the user cannot send messages to the chat', async () => {
                        const response = await request(app).post(`/api/chats/${config.sampleChatId}/messages`).set('Cookie', [`jwt=${config.uninvitedUserToken}`])
                        .send({
                            content: 'Message from romeo'
                        })
                        expect(response.statusCode).toBe(403)
                        expect(response.body.error).toBe('Cannot send messages to this chat')
                    })
                })
                describe('when user is authorized to send messages to the chat', () => {
                    test('respond with 201, message stating the chat message was sent and the chat message object', async () => {
                        const response = await request(app).post(`/api/chats/${config.sampleChatId}/messages`).set('Cookie', [`jwt=${config.sampleToken}`])
                        .send({
                            content: 'This is a message from tango'
                        })
                        expect(response.statusCode).toBe(201)
                        expect(response.body.message).toBe('Chat message successfully sent')
                        expect(response.body.chatMessage).toBeDefined()
                    })
                })
            })
        })

    })
})