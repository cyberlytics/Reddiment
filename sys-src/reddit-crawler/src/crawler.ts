import { requester as crawler } from './auth';
import Snoowrap from 'snoowrap';

// Backend connection
///////////////////////////////////////////////////////////////////////////////////////////////////////

const BackendURL = `http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}/graphql`;

let subredditsToSearch = new Array<string>();

async function transmitComment(comment: Snoowrap.Comment) {
    const result = await fetch(BackendURL, {
        method: 'post',
        body: JSON.stringify({
            query: "mutation AddComment($comment: Comment!) {\n  addComment(comment: $comment)\n}",
            variables: {
                comment: {
                    articleId: comment.parent_id.substring(3),
                    commentId: comment.id,
                    subredditName: comment.subreddit_name_prefixed,
                    text: comment.body,
                    timestamp: new Date(comment.created_utc * 1000).toISOString(),
                    userId: comment.author.id,
                    upvotes: comment.ups,
                    downvotes: comment.downs,
                }
            },
            operationName: "AddComment"
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

setInterval(async () => {
    try {
        const result = await fetch(BackendURL, {
            method: 'post',
            body: JSON.stringify({
                query: "query GetJobs { jobs }",
                operationName: "GetJobs"
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const obj = await result.json();
        subredditsToSearch = (obj?.data?.jobs ?? []);
    }
    catch (ex: any) {
        console.log('error', ex);
    }
}, 60 * 1000);


// Reddit Crawler
///////////////////////////////////////////////////////////////////////////////////////////////////////

// /**
//  * Gets a Listing of new posts on this subreddit.
//  */
crawler.getSubreddit('r/wallstreetbets').getNew({}).then(async (data) => {
    
    let fetchedData = await data.fetchAll({
        amount: 10,
    });

    // console.log(data.length);
    // console.log(data.toJSON());
    // console.log(fetchedData.length)

    fetchedData.forEach(sraw => {
        sraw.fetch().then(s => {
            //console.log(s.comments.length); // ständig leer, weiß nicht warum
            s.comments.forEach(c => {
                // console.log(c.body);
                transmitComment(c)
            });
        });
    })
})

/**
 * Gets a Listing of new comments on this subreddit.
 */
crawler.getSubreddit('r/wallstreetbets').getNewComments({}).then(async (data) => {

    const fetchedData = await data.fetchAll();

    // console.log(data.length);
    // console.log(fetchedData.length);

    fetchedData.forEach(c => transmitComment(c));
})


setInterval(() => {
    
}, 60 * 1000);
///////////////////////////////////////////////////////////////////////////////////////////////////////
