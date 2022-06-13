import { requester as crawler } from './snoowrap/snoowrap'
import express from 'express'
import { setTimeout } from 'timers';
import Snoowrap from 'snoowrap';

// Backend-Anbindung 
const app = express();
const port = 4000;
const route = '/';

// app.listen(port, () => {
//     crawler.search({ query: "r/wallstreetbets" }).then((data: { toJSON: () => any; }) => {
//         var dataJSON = data.toJSON();
//         console.log(dataJSON);
//         app.post(route, (req, res) => {
//             res.send(dataJSON)
//         })
//     })
// })
 
///////////////////////////////////////////////////////////////////////////////////////////////////////

// /**
//  * Gets a Listing of hot posts on this subreddit.
//  * getHot.Options = {after?,before?,count?,limit?,show?}
//  */
// crawler.getSubreddit('r/wallstreetbets').getHot({}).then(data => {
//     let fetchedData = data.fetchAll().toJSON();
//     // TODO: send to backend
// })

// /**
//  * Gets a Listing of new posts on this subreddit.
//  * getNew.Options = {after?,before?,count?,limit?,show?}
//  */
// crawler.getSubreddit('r/wallstreetbets').getNew({}).then(data => {
//     let fetchedData = data.fetchAll().toJSON();
//     // TODO: send to backend
// })

// /**
//  * Gets a Listing of new comments on this subreddit.
//  */
//  crawler.getSubreddit('r/wallstreetbets').getNewComments({}).then(data => {
//     let fetchedData = data.fetchAll().toJSON();
//     // TODO: send to backend
// })

// /**
//  * Gets a Listing of top posts on this subreddit.
//  * getTop.Options = {after?,before?,count?,limit?,show?,time?}
//  */
//  crawler.getSubreddit('r/wallstreetbets').getTop({}).then(data => {
//     let fetchedData = data.fetchAll().toJSON();
//     // TODO: send to backend
// })

// /**
//  * Gets a Listing of controversial posts on this subreddit.
//  * getControversial.Options = {after?,before?,count?,limit?,show?,time?}
//  */
//  crawler.getSubreddit('r/wallstreetbets').getControversial({}).then(data => {
//     let fetchedData = data.fetchAll().toJSON();
//     // TODO: send to backend
// })

///////////////////////////////////////////////////////////////////////////////////////////////////////

function searchSubreddit(
    query: string,
    time?: "all" | "hour" | "day" | "week" | "month" | "year" | undefined,
    subreddit?: string | undefined,
    sort?: "relevance" | "hot" | "top" | "new" | "comments" | undefined) {
    crawler.search({ query: query, time: time, subreddit: subreddit, sort: sort }).then(data => {
        return data.toJSON()
    })
}

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