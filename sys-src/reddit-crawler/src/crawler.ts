/**
 * Reddit Crawler
 */

import { Subreddit } from "snoowrap";
import { transmitComment, subredditQueue } from "./backendConnection";

const getRefreshedSubredditData = async (subreddit: Subreddit) => {
    subreddit.refresh().then(async refreshedSubreddit => {
        console.log(`${refreshedSubreddit.display_name} Refreshed`);

        // get new comments
        const rawComments = await refreshedSubreddit.getNewComments();
        console.log(`Got new comments: ${rawComments.length}`);

        const fetchedComments = await rawComments.fetchMore({ amount: 100 });
        console.log(`Fetched Comments: ${fetchedComments.length}`);
        for (let i = 0; i < fetchedComments.length; i++) {
            await transmitComment(fetchedComments[i]);
        }
        console.log(`Done transmitting comments`);
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
}, 60 * 1000 / 60); // every 60 seconds
