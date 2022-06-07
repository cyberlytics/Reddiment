
import Snoowrap, { Comment, Listing, Submission, Subreddit } from 'snoowrap'
import Dotenv from 'dotenv'
// import express from 'express'

Dotenv.config({path: 'config.env'})

/** config object to organize Reddit configuration variables */
const config = {
    username: process.env.username,
    password: process.env.password,
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    userAgent: process.env.reddiment
}

console.log(process.env)

// Snoowrap class methods

 /** snoowrap instance to connect to Reddit service */
const requester = new Snoowrap({
    userAgent: config.userAgent,
    clientId: config.clientId,
    clientSecret: config.clientSecret
})

/** GET: Gets information on a comment with a given id.
 * returnType: Comment 
 * https://not-an-aardvark.github.io/snoowrap/snoowrap.html#getComment__anchor
*/
function getComment(commentId: string):Comment {
    return requester.getComment(commentId)
}

/** GET: Gets information on a given subreddit.
 * returnType: Subreddit 
 * https://not-an-aardvark.github.io/snoowrap/snoowrap.html#getSubreddit__anchor
*/
function getSubreddit(displayName: string):Subreddit {
    return requester.getSubreddit(displayName)
}

/** GET: Gets information on a given submission.
 * returnType: Submission 
 * https://not-an-aardvark.github.io/snoowrap/snoowrap.html#getSubmission__anchor
*/
function getSubmission(submissionId: string):Submission {
    return requester.getSubmission(submissionId)
}

/** GET: Gets a Listing of hot posts.
 * returnType: Listing<Submission> 
 * https://not-an-aardvark.github.io/snoowrap/snoowrap.html#getHot__anchor
*/
function getHot(subredditName?: string, options?: object):Promise<Listing<Submission>> {
    return requester.getHot(subredditName, options)
}

/** GET: Gets a Listing of best posts.
 * returnType: Listing<Submission> 
 * https://not-an-aardvark.github.io/snoowrap/snoowrap.html#getBest__anchor
*/
function getBest(options?: object):Promise<Listing<Submission>> {
    return requester.getBest(options)
}

/** GET: Gets a Listing of new posts.
 * returnType: Promise<Listing<Submission>>
 * https://not-an-aardvark.github.io/snoowrap/snoowrap.html#getNew__anchor
 */
function getNew(subredditName?: string, options?: object):Promise<Listing<Submission>> {
    return requester.getNew(subredditName, options)
}

/** GET: Gets a Listing of new comments 
 * returnType: Listing<Comment> 
 * https://not-an-aardvark.github.io/snoowrap/snoowrap.html#getNewComments__anchor
*/
function getNewComments(subredditName?: string, options?: object):Promise<Listing<Comment>> {
    return requester.getNewComments(subredditName, options)
}

/** GET: Gets a Listing of top posts.
 * returnType: Listing<Submission> 
 * https://not-an-aardvark.github.io/snoowrap/snoowrap.html#getTop__anchor
*/
function getTop(subredditName?: string, options?: object):Promise<Listing<Submission>> {
    return requester.getTop(subredditName, options)
}

/** GET: Gets a Listing of controversial posts.
 * returnType: Listing<Submission> 
 * https://not-an-aardvark.github.io/snoowrap/snoowrap.html#getControversial__anchor
*/
function getControversial(subredditName?: string, options?: object):Promise<Listing<Submission>> {
    return requester.getControversial(subredditName, options)
} 

/** GET: Gets a Listing of controversial posts.
 * returnType: Listing<Submission> 
 * https://not-an-aardvark.github.io/snoowrap/snoowrap.html#getRising__anchor
*/
function getRising(subredditName?: string, options?: object):Promise<Listing<Submission>> {
    return requester.getRising(subredditName, options)
} 

/** GET: Conducts a search of reddit submissions.
 * returnType: Listing<Submission> 
 * https://not-an-aardvark.github.io/snoowrap/snoowrap.html#search__anchor
*/
function search(
    query: string, 
    selectedTime?: "hour" | "day" | "week" | "month" | "year" | "all", 
    subreddit?: Subreddit | string, 
    restrictSr?: boolean, 
    selectedSort?: "relevance" | "hot" | "top" | "new" | "comments", 
    selectedSyntax?: "cloudsearch" | "lucene" | "plain")
    :Promise<Listing<Submission>> {
        return requester.search({query, time: selectedTime, subreddit, restrictSr, sort:selectedSort, syntax: selectedSyntax})
} 

/** GET: Searches for subreddits given a query.
 * returnType: Listing<Submission> 
 * https://not-an-aardvark.github.io/snoowrap/snoowrap.html#searchSubredditNames__anchor
*/
function searchSubredditNames(query: string, exact?: boolean, includeNsfw?: boolean):Promise<string[]> {
    return requester.searchSubredditNames({query, exact, includeNsfw})
}

// DEPRECATED
/** GET: Searches subreddits by topic.
 * returnType: Listing<Submission>
 * https://not-an-aardvark.github.io/snoowrap/snoowrap.html#searchSubredditTopics__anchor
*/
// function searchSubredditTopics(options: object):Promise<Subreddit[]> {
//     return requester.searchSubredditTopics(options)
// }

/** GET: Searches subreddits by title and description.
 * returnType: Listing<Subreddit> 
 * https://not-an-aardvark.github.io/snoowrap/snoowrap.html#searchSubreddits__anchor
*/
function searchSubreddits(options: object, query: string):Promise<Listing<Subreddit>> {
    return requester.searchSubreddits({query: query})
}

/** GET: Gets a list of subreddits, arranged by age.
 * returnType: Listing<Subreddit>
 * https://not-an-aardvark.github.io/snoowrap/snoowrap.html#getNewSubreddits__anchor
 */
function getNewSubreddits(options?: object):Promise<Listing<Subreddit>> {
return requester.getNewSubreddits(options)
}

/** GET: Gets a Listing of Submissions that are related to this one 
 * returnType: Listing<Submission>
 * https://not-an-aardvark.github.io/snoowrap/Submission.html#getRelated__anchor
 */
// function getRelated(options?: object):Listing<Submission> {
//     return requester.getRelated(options)
// }

/** GET: Refreshes this content.
 * returnType: Promise<Listing<
 * https://not-an-aardvark.github.io/snoowrap/Comment.html#refresh__anchor
 */
// function refreshComment(someComment: Comment, timeout: number):Comment {
//     var someComment = requester.getComment('cmfkyus');
//     var initialCommentBody = someComment.fetch().then(comment => comment.body);
    
//     setTimeout(() => {
//       someComment.refresh().then(refreshedComment => {
//         if (initialCommentBody.value() !== refreshedComment.body) {
//           return refreshedComment
//         }
//         return someComment
//       });
//     }, timeout);
//     return someComment
// }

/** CONSOLE: toConsole */
function toConsole(obj: object) {
    console.log(obj)
}

/** SAVE: toJSON */
function toJSON(obj: object) {
    return JSON.stringify(obj)
}