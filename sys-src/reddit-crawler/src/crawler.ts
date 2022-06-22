/**
 * Reddit Crawler
 */

import { Subreddit } from "snoowrap";
import { transmitComment, subredditQueue } from "./backendConnection";

const getRefreshedSubredditData = async (subreddit: Subreddit) => {
    subreddit.refresh().then(async refreshedSubreddit => {
        console.log(`${refreshedSubreddit.display_name} REFRESHED`);

        // get new comments
        const rawComments = await refreshedSubreddit.getNewComments();

        const fetchedComments = await rawComments.fetchMore({ amount: 100 });
        for (let i = 0; i < fetchedComments.length; i++) {
            await transmitComment(fetchedComments[i]);
        }
    });
}

/**
 * Get all Comments of Subreddit and their Submissions
 */
setInterval(async () => {
    try {
        const subreddit = subredditQueue.pop();
        if (subreddit) {
            await getRefreshedSubredditData(subreddit);
        }
        /*
        while (subredditQueue.length > 0) {
            const subreddit = subredditQueue.pop();
            if (subreddit) {
                await getRefreshedSubredditData(subreddit);
            }
        }*/
    } catch (error) {
        console.log('error', error);
    }
}, 60 * 1000); // every 60 seconds
