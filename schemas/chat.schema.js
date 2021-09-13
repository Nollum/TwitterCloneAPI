const mongoose = require('mongoose')

const ChatSchema = new mongoose.Schema({
    users: [{
        type: String,
        required: true,
        ref: 'User'
    }]

}, {
    timestamps: true,
    collection: 'chats'
})

module.exports = mongoose.model('Chat', ChatSchema)