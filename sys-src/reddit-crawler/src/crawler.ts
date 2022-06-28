/**
 * Reddit Crawler
 */

import { Submission, Subreddit } from "snoowrap";
import { transmitComment, subredditQueue } from "./backendConnection";

const submissionsAlreadyFetched = new Array<string>();

const getRefreshedSubredditData = async (subreddit: Subreddit) => {
    subreddit.refresh().then(async refreshedSubreddit => {
        console.log(`${refreshedSubreddit.display_name} Refreshed`);

        // get new comments
        let fetchedComments = await refreshedSubreddit.getNewComments({});
        console.log(`Fetched Comments: ${fetchedComments.length}`);
        for (let i = 0; i < fetchedComments.length; i++) {
            await transmitComment(fetchedComments[i]);
        }
        console.log(`Done transmitting comments`);
        try {
            while (fetchedComments?.length > 0) {
                fetchedComments = await fetchedComments.fetchMore({ amount: 100, skipReplies: true, append: false });

                console.log(`Fetched Comments: ${fetchedComments.length}`);
                for (let i = 0; i < fetchedComments.length; i++) {
                    await transmitComment(fetchedComments[i]);
                }
                console.log(`Done transmitting comments`);
            }
        }
        catch (e: any) {
            console.log('error', e);
            process.exit(); // Exit process (Docker Compose will restart automatically)
        }
        if (fetchedComments.length === 0) {
            if (typeof submissionsAlreadyFetched.find(s => s === subreddit.name) === 'undefined') {
                // get new submissions
                let fetchedSubmissions = await refreshedSubreddit.getNew({});
                let newlyFetchedSubmissions = 1; // Dummy value
                try {
                    while (newlyFetchedSubmissions > 0) {
                        fetchedSubmissions = await fetchedSubmissions.fetchMore({ amount: 100, skipReplies: false, append: false });
                        newlyFetchedSubmissions = fetchedSubmissions.length;
                        console.log(`Fetched another ${fetchedSubmissions.length} Submissions`);

                        for (let i = 0; i < fetchedSubmissions.length; i++) {
                            const comments = await fetchedSubmissions[i].comments.fetchAll();
                            for (let j = 0; j < comments.length; j++) {
                                await transmitComment(comments[j]);
                            }
                        }
                        console.log(`Done transmitting comments`);
                    }
                }
                catch (e: any) {
                    console.log('error', e);
                    process.exit(); // Exit process (Docker Compose will restart automatically)
                }

                submissionsAlreadyFetched.push(subreddit.name);
            }
            setTimeout(doWork, 10 * 60 * 1000); // Try again in 10 minutes (this API does only return "new" comments, approx 1000. So fetching every few seconds does not help)
        }
    });
}

const doWork = async () => {
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
};

/**
 * Get all Comments of Subreddit and their Submissions
 */
setTimeout(doWork, 60 * 1000); // First Delay: 60 Seconds
