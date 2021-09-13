const Chat = require('../schemas/chat.schema')
const User = require('../schemas/user.schema')
const Message = require('../schemas/message.schema')

exports.createChat = async (req, res) => {
    try {
        // Get the users from the request body
        // These are the users that the current user is trying to initiate a chat with
        const users = req.body.users

        if (!users) return res.status(422).json({error: 'Users not received'})

        for (user of users) {
            const exists = await User.findById(user)
            if (!exists) return res.status(404).json({error: 'User(s) does not exist'})
        }

        // Append the user that made the request to the users array
        users.push(res.locals.userId)

        const chat = new Chat({users})

        await chat.save()

        return res.status(201).json({message: 'Chat successfully created', users})

    } catch (err) {
        return res.status(500).send()
    }
}

exports.getMessages = async (req, res) => {
    try {
        const chatId = req.params.chatId
        const userId = res.locals.userId

        // Find the chat by chat ID and make sure the user is part of it
        let chat = await Chat.findOne({ _id: chatId, users: { $elemMatch: { $eq: userId } } }).populate('users')

        if (!chat) return res.status(404).json({error: 'Chat does not exist'})

        let chatMessages = await Message.find({ chat: chatId }).populate('sender')

        return res.status(200).json({message: 'Chat successfully retreived', chat, chatMessages})
    } catch (err) {
        return res.status(500).send()
    }
}

exports.sendMessage = async (req, res) => {
    try {
        const chatId = req.params.chatId
        const content = req.body.content

        if (!content) return res.status(422).json({error: 'Cannot send empty message'})

        const chat = await Chat.findById(chatId)

        if (!chat) return res.status(404).json({error: 'Chat does not exist'})

        // Check if the sender is part of the chat
        if (!chat.users.includes(res.locals.userId)) {
            return res.status(403).json({error: 'Cannot send messages to this chat'})
        }

        // Create a new message with the user ID as the sender, chat ID as the chat and content
        const chatMessage = new Message({sender: res.locals.userId, chat: chat._id, content})

        await chatMessage.save()

        return res.status(201).json({message: 'Chat message successfully sent', chatMessage})

    } catch (err) {
        return res.status(500).send()
    }
}
