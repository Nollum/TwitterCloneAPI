const Tweet = require('../schemas/tweet.schema')
const User = require('../schemas/user.schema')

exports.createTweet = async (req, res) => {
    try {
        // Get the content from request body
        const { content } = req.body

        // If no text is provided return 422
        if (!content) return res.status(422).json({error: 'Cannot post empty tweet'})

        // Get the ID of user from response object
        const userId = res.locals.userId

        // Create a new tweet
        let tweet = new Tweet({
            authorId: userId,
            content: content
        })
        // Save tweet into the database
        await tweet.save()

        return res.status(201).json({message: 'Tweet successfully created', tweet})
    } catch (err) {
        return res.status(500).send()
    }
}

exports.readTweet = async (req, res) => {
    try {
        const tweetId = req.params.tweetId

        let tweet = await Tweet.findById(tweetId)

        if (!tweet) return res.status(404).json({error: 'Tweet does not exist'})

        return res.status(200).json({message: 'Tweet successfully retreived', tweet})
    } catch (err) {
        return res.status(500).send()
    }
}

exports.updateTweet = async (req, res) => {
    try {
        const { content } = req.body
        // Get the tweet ID from the URL
        const tweetId = req.params.tweetId
        const userId = res.locals.userId

        // If no updates are provided return 422
        if (!content) return res.status(422).json({error: 'Cannot update tweet with empty content'})

        let tweet = await Tweet.findById(tweetId)

        if (!tweet) return res.status(404).json({error: 'Tweet does not exist'})

        // Check that the user has the authority to update the tweet
        // convert authorId field from Object to String in order to match the types
        if (userId !== tweet.authorId.toString()) return res.status(403).json({error: 'Unauthorized access to resource'})

        // Overwrite the tweet with new content
        tweet.content = content

        await tweet.save()

        return res.status(200).json({message: 'Tweet successfully updated', tweet})
        
    } catch (err) {
        return res.status(500).send()
    }
}

exports.deleteTweet = async (req, res) => {
    try {

        const tweetId = req.params.tweetId
        const userId = res.locals.userId

        let tweet = await Tweet.findById(tweetId)

        if (!tweet) return res.status(404).json({error: 'Tweet does not exist'})

        // Check that the user has the authority to update the tweet
        // convert authorId field from Object to String in order to match the types
        if (userId !== tweet.authorId.toString()) return res.status(403).json({error: 'Unauthorized access to resource'})

        await Tweet.findByIdAndDelete(tweetId)

        return res.status(200).json({message: 'Tweet successfully deleted', tweet})

    } catch (err) {
        return res.status(500).send()
    }
}

exports.likeTweet = async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.tweetId)
        const user = await User.findById(res.locals.userId)

        if (!tweet) return res.status(404).json({error: 'Tweet does not exist'})

        // If tweet is already liked, unlike it
        if (user.likes.includes(tweet._id)) {
            // Remove the reference from user's likes
            await User.findByIdAndUpdate(res.locals.userId, { $pull: { likes: tweet._id } });
            // Decrement the like counter
            await Tweet.findByIdAndUpdate(tweet._id, { $inc: { likeCounter: -1 } });

            return res.status(200).json({message: 'Tweet successfully unliked', tweet})
        }

        // If tweet is not liked, like it

        // Push the tweet id into user's likes
        await User.findByIdAndUpdate(res.locals.userId, { $push: { likes: tweet._id } });

        // Increment the like counter
        await Tweet.findByIdAndUpdate(tweet._id, { $inc: { likeCounter: 1 } });

        return res.status(200).json({message: 'Tweet successfully liked', tweet})

    } catch (err) {
        return res.status(500).send()
    }
}

// Basically the same as likeTweet in this case
exports.reTweet = async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.tweetId)
        const user = await User.findById(res.locals.userId)

        if (!tweet) return res.status(404).json({error: 'Tweet does not exist'})

        // If user has already retweeted the tweet, remove the retweet
        if (user.retweets.includes(tweet._id)) {
            // Remove the reference from user's likes
            await User.findByIdAndUpdate(res.locals.userId, { $pull: { retweets: tweet._id } });
            // Decrement the like counter
            await Tweet.findByIdAndUpdate(tweet._id, { $inc: { retweetCounter: -1 } });

            return res.status(200).json({message: 'Successfully removed the retweet', tweet})
        }

        // If the tweet has not yet been retweeted by the user, retweet it

        // Push the tweet id into user's retweets
        await User.findByIdAndUpdate(res.locals.userId, { $push: { retweets: tweet._id } });

        // Increment the retweet counter
        await Tweet.findByIdAndUpdate(tweet._id, { $inc: { retweetCounter: 1 } });

        return res.status(200).json({message: 'Successfully retweeted the tweet', tweet})

    } catch (err) {
        return res.status(500).send()
    }
}