import Snoowrap from 'snoowrap'
import fs from 'fs';

function readFile(path: string): string|undefined {
    if(fs.existsSync(path)) {
        return fs.readFileSync(path)?.toString('utf-8');
    }
    return undefined;
}


export const requester = new Snoowrap({
    username: process.env.REDDIT_USERNAME || 'reddiment-bot',
    password: readFile('/run/secrets/reddit_login_password') || 'reddiment123,.-',
    userAgent: process.env.REDDIT_USER_AGENT || 'reddiment-script',
    clientId: process.env.REDDIT_CLIENT_ID || '8OguKkRA6T2BhvMi0C-bcA',
    clientSecret: readFile('/run/secrets/reddit_client_secret') || 'pijvpzZ0rCkrGTegt4ndliPJjHkcKw'
});




