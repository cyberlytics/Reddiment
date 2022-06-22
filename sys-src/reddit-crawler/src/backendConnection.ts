/**
 * Backend connection
 */

import Snoowrap from "snoowrap";
import { requester as crawler } from "./auth";

const BackendURL = `http://${process.env.BACKEND_ADDR}/graphql`;

export let subredditQueue = new Array<Snoowrap.Subreddit>();

/**
 * Send relevant comment data to backend
 * @param comment a Snoowrap.Comment object, containing all comment data
 */
export async function transmitComment(comment: Snoowrap.Comment) {
    try {
        const response =  await fetch(BackendURL, {
            method: 'post',
            body: JSON.stringify({
                query: "mutation AddComment($comment: Comment!) {addComment(comment: $comment)}",
                variables: {
                    comment: {
                        articleId: comment.parent_id.substring(3),
                        commentId: comment.id,
                        subredditName: comment.subreddit_name_prefixed,
                        text: comment.body,
                        timestamp: new Date(comment.created_utc * 1000).toISOString(),
                        userId: comment.author_fullname,
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
        console.log(await response.json());
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
        const subredditsToSearch = (obj?.data?.jobs ?? []);
        for (const i in subredditsToSearch) {
            const foundItems = subredditQueue.filter(
                item => item.display_name === subredditsToSearch[i].slice(2)
            );
            if (foundItems.length !== 0) continue;
            subredditQueue.push(crawler.getSubreddit(subredditsToSearch[i]));
        }
    }
    catch (error: any) {
        console.log('error', error);
    }
}, 10 * 1000);

