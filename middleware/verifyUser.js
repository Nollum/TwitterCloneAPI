const jwt = require('jsonwebtoken')
const config = require('../config.json')

const verifyUser = (req, res, next) => {

    // Get the json web token from the cookie
    let token = req.cookies.jwt;
    
    // If no token is found, the user is not authenticated
    if (!token) {
        return res.status(403).json({ error: 'User not authenticated' });
    }
    
    let tokenPayload;
  
    try {
        // Verify that the token is valid
        tokenPayload = jwt.verify(token, config.secret);

        // Store the user ID in the response object
        // This is later used to assign a tweet its author
        res.locals.userId = tokenPayload.id;

        // If valid, proceed to the next middleware function
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid access token' });
    }
};
  
module.exports = verifyUser;