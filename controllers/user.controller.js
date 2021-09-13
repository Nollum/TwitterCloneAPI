const User = require('../schemas/user.schema')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('../config.json')

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body

        // Check if username is empty
        if (!username) return res.status(422).json({error: 'Please provide a username'})
        
        // Check if password is empty
        if (!password) return res.status(422).json({error: 'Please provide a password'})
        
        // Check if username already exists
        let user = await User.findOne({ username })

        if (user) return res.status(409).json({error: 'Username already exists'})

        // Generate a salt for the hash
        const salt = await bcrypt.genSalt(10);
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            username: username,
            password: hashedPassword
        })

        await user.save()

        return res.status(201).json({message: 'User successfully registered', username})

    } catch (err) {
        return res.status(500).send()
    }
}

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body

        // Check if username is empty
        if (!username) return res.status(422).json({error: 'Please provide a username'})

        // Check if password is empty
        if (!password) return res.status(422).json({error: 'Please provide a password'})

        const user = await User.findOne({ username })

        if (!user) return res.status(404).json({error: 'User does not exist'})

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) return res.status(401).json({ error: 'Incorrect password' });

        // Create the payload for the jsonwebtoken
        let tokenPayload = { id: user._id, username: username };

        /* Sign the JWT with the payload, a secret key, and set the algorithm to HS256
          In this case the JWT has no expiration time, but it can be set when needed,
          for instance when using refresh tokens */
        let token = jwt.sign(tokenPayload, config.secret, {algorithm: 'HS256'})

        /* Send the cookie (expires in 1 hour) that contains the JWT along with the object
         containing a success message, username and the JWT value */
        return res.status(200)
        .cookie('jwt', token, { httpOnly: true, maxAge: 3600000})
        .json({message: 'User successfully logged in', username, token})

    } catch (err) {
        return res.status(500).send()
    }
}