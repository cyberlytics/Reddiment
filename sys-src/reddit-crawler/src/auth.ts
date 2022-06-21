import Snoowrap from 'snoowrap'
import fs from 'fs';



export const requester = new Snoowrap({
    username: process.env.REDDIT_USERNAME || 'reddiment-bot',
    password:  fs.readFileSync('/run/secrets/reddit_login_password')?.toString('utf-8') || 'reddiment123,.-',
    userAgent: process.env.REDDIT_USER_AGENT || 'reddiment-script',
    clientId: process.env.REDDIT_CLIENT_ID || '8OguKkRA6T2BhvMi0C-bcA',
    clientSecret: fs.readFileSync('/run/secrets/reddit_client_secret')?.toString('utf-8') || 'pijvpzZ0rCkrGTegt4ndliPJjHkcKw'
})




