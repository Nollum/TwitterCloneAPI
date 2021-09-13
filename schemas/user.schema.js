const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({

    username: {
        type: String,
        unique: true,
        required: true
    },
    
    password: {
        type: String,
        required: true
    },

    likes: [{
        type: mongoose.Types.ObjectId,
        ref: 'Tweet'
    }],

    retweets: [{
        type: mongoose.Types.ObjectId,
        ref: 'Tweet'
    }]

}, {
    timestamps: true,
    collection: 'users'
})

module.exports = mongoose.model('User', UserSchema)