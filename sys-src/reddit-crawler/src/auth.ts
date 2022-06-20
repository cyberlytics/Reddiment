import Snoowrap from 'snoowrap'




/*export const requester = new Snoowrap({
    username: 'reddiment-bot',
    password: 'reddiment123,.-',
    userAgent: 'reddiment-script',
    clientId: '8OguKkRA6T2BhvMi0C-bcA',
    clientSecret: 'pijvpzZ0rCkrGTegt4ndliPJjHkcKw'
})*/



const fs = require('fs')



export const requester = new Snoowrap({
    username: process.env.REDDIT_USERNAME || 'reddiment-bot',
    password:  fs.readFile('/run/secrets/reddit_login_password.txt') || 'reddiment123,.-',
    userAgent: process.env.REDDIT_USER_AGENT || 'reddiment-script',
    clientId: process.env.REDDIT_CLIENT_ID || '8OguKkRA6T2BhvMi0C-bcA',
    clientSecret: fs.readFile('/run/secrets/reddit_client_secret.txt') || 'pijvpzZ0rCkrGTegt4ndliPJjHkcKw'
})




