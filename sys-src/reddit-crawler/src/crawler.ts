import { requester as crawler } from './auth';
import Snoowrap, { Comment, Listing, Submission, Subreddit } from 'snoowrap';

// Backend connection
///////////////////////////////////////////////////////////////////////////////////////////////////////

const BackendURL = `http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}/graphql`;

let subredditsToSearch = new Array<string>();

/**
 * Send relevant comment data to backend
 * @param comment a Snoowrap.Comment object, containing all comment data
 */
async function transmitComment(comment: Snoowrap.Comment) {
    try {
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
    } catch (error) {
        console.log('error', error);
    }
}

/**
 * Receive a task list to work through in 
 */
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
    catch (error: any) {
        console.log('error', error);
    }
}, 60 * 1000);


/** 
 * Reddit Crawler
 */
///////////////////////////////////////////////////////////////////////////////////////////////////////

const cs_limit = 100; 
const sms_limit = 25;

let sr_queue = new Array<Snoowrap.Subreddit>();

subredditsToSearch.push('r/wallstreetbets')
subredditsToSearch.push('r/wallstreetbets')

/**
 * Fill Subreddit Queue
 */
setInterval(async () => {
        try {
            while(subredditsToSearch.length > 0){
                let sr_name = subredditsToSearch.pop();
                if(sr_name){
                    let sr = crawler.getSubreddit(sr_name);
                    sr_queue.push(sr);
                    console.log("SUBREDDIT PUSHED");
                    
                }
            }
        } catch (error) {
            console.log('error', error);
        }
}, 10 * 1000); // every 10 seconds


/**
 * Get all Comments of Subreddit and their Submissions
 */
setInterval(async () => {
    try {
        while (sr_queue.length > 0) {
            let sr = sr_queue.pop();
            if(sr){
                await sr.refresh().then(rf_sr => {
                    console.log("SUBREDDIT REFRESHED");
                    
                    rf_sr.getNewComments().then(async raw_cs => {
                        let ft_cs = await raw_cs.fetchAll({amount: cs_limit});
                        console.log("FETCHED COMMENTS: " + ft_cs.length);
        
                        ft_cs.forEach(c => transmitComment(c));
                    })
                    rf_sr.getNew().then(async raw_sms=> {
                        const ft_sms = await raw_sms.fetchAll({amount: sms_limit});
                        ft_sms.forEach(async raw_sm =>{
                            await raw_sm.fetch().then(async ft_sm => {
                                const ft_cs = await ft_sm.comments.fetchAll({amount: cs_limit});
                                console.log("FETCHED COMMENTS IN SUBMISSION: " + ft_cs.length);
                                
                                ft_cs.forEach(c => transmitComment(c));
                            })
                        })
                    })
                })
            }
        }
    } catch (error) {
        console.log('error', error);        
    }
}, 60 * 1000); // every 60 seconds