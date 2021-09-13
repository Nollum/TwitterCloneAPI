const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },

    chat: {
        type: mongoose.Types.ObjectId,
        ref: 'Chat',
        required: true
    },

    content: {
        type: String,
        trim: true,
        required: true
    }
})

module.exports = mongoose.model('Message', MessageSchema)