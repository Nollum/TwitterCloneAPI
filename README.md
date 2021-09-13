# TwitterCloneAPI

## Run the app
Use `npm run dev` to run the app with nodemon <br>

## Run the tests
In order to run the tests, use `npm test -- filename`
For instance, to test user registration, use `npm test -- register.test.js` <br>
Tests should preferably follow this order, however they could technically work in any order: <br>
`
register,
login,
verifyUser,
createTweet,
updateTweet,
readTweet,
deleteTweet,
createChat,
sendMessage,
getMessages,
likeTweet,
reTweet,
`
