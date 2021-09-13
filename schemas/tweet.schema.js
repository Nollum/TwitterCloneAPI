const mongoose = require('mongoose')

const TweetSchema = new mongoose.Schema({

    authorId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    likeCounter: {
        type: Number,
        default: 0,
        required: true
    },

    retweetCounter: {
        type: Number,
        default: 0,
        required: true
    },
    
    content: {
        type: String,
        required: true
    },

}, {
    timestamps: true,
    collection: 'tweets'
})

module.exports = mongoose.model('Tweet', TweetSchema)