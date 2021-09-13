const express = require('express')
const router = express.Router()

// User functions
const { register, login } = require('../controllers/user.controller')

// Tweet functions
const { createTweet, readTweet, updateTweet, deleteTweet, likeTweet, reTweet } = require('../controllers/tweet.controller')

// Chat functions
const { createChat, getMessages, sendMessage } = require('../controllers/chat.controller')

// Middleware
const verifyUser = require('../middleware/verifyUser')

// User routes
router.post('/users/register', register)

router.post('/users/login', login)

// Tweet routes
router.post('/tweets', verifyUser, createTweet)

router.get('/tweets/:tweetId', readTweet)

router.patch('/tweets/:tweetId', verifyUser, updateTweet)

router.delete('/tweets/:tweetId', verifyUser, deleteTweet)

router.patch('/tweets/:tweetId/like', verifyUser, likeTweet)

router.patch('/tweets/:tweetId/retweet', verifyUser, reTweet)

// Chat routes
router.post('/chats', verifyUser, createChat)

router.get('/chats/:chatId/messages', verifyUser, getMessages)

router.post('/chats/:chatId/messages', verifyUser, sendMessage)

module.exports = router;
