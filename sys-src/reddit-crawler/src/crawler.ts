import { requester as crawler } from './snoowrap/snoowrap';
import Snoowrap from 'snoowrap';

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

// setInterval(async () => {
//     try {
//         const result = await fetch(BackendURL, {
//             method: 'post',
//             body: JSON.stringify({
//                 query: "query GetJobs { jobs }",
//                 operationName: "GetJobs"
//             }),
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });

//         const obj = await result.json();
//         subredditsToSearch = (obj?.data?.jobs ?? []);
//     }
//     catch (ex: any) {
//         console.log('error', ex);
//     }
// }, 60 * 1000);


///////////////////////////////////////////////////////////////////////////////////////////////////////

// /**
//  * Gets a Listing of new posts on this subreddit.
//  * getNew.Options = {after?,before?,count?,limit?,show?}
//  */
crawler.getSubreddit('r/wallstreetbets').getNew({}).then(async (data) => {
    let fetchedData = await data.fetchAll();
    console.log(data.length);
    console.log(fetchedData.length)
    fetchedData.forEach(c => console.log(c.comments.toJSON()))

    // TODO: send to backend
})

/**
 * Gets a Listing of new comments on this subreddit.
 */
crawler.getSubreddit('r/wallstreetbets').getNewComments({}).then(async (data) => {

    // console.log(data.length);
    // const fetchedData = await data.fetchAll();
    // console.log(fetchedData.length);

    // fetchedData.forEach(c => transmitComment(c));
})

///////////////////////////////////////////////////////////////////////////////////////////////////////


// var wallstreetbets : Snoowrap.Subreddit
// setTimeout(() => {
// crawler.getSubreddit('r/wallstreetbets').fetch().then(subreddit => {
//         subreddit.refresh().then(refreshSubreddit =>{
//             if(subreddit !== refreshSubreddit){
//                 wallstreetbets = refreshSubreddit
//                 console.log("SUBREDDIT REFRESHED");
//                 console.log(wallstreetbets)
//             }
//             else {
//                 console.log("SUBREDDIT NICHT REFRESHED");
//             }
//         })
//     })
// }, 0); // täglich = 86400000ms




