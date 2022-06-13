"use strict";
exports.__esModule = true;
var snoowrap_1 = require("./snoowrap/snoowrap");
var express = require("express");
// Backend-Anbindung 
var app = express();
var port = 4000;
var route = '/';
// app.listen(port, () => {
//     crawler.search({ query: "r/wallstreetbets" }).then((data: { toJSON: () => any; }) => {
//         var dataJSON = data.toJSON();
//         console.log(dataJSON);
//         app.post(route, (req, res) => {
//             res.send(dataJSON)
//         })
//     })
// })
/**
 * Gets a Listing of new posts on this subreddit.
 */
// crawler.getSubreddit('r/wallstreetbets').getNew().then(data => {
//     console.log("GETNEW :" + data.toJSON());
//     // TODO: Send to Backend
// })
snoowrap_1.requester.getSubreddit('r/wallstreetbets').getNewComments().then(function (data) {
    var allDataJSON = data.fetchAll({ amount: 100000, append: true }).toJSON();
    console.log("GETALL" + allDataJSON);
});
// export async function scrapeSubreddit() {
//     const subreddit = await crawler.getSubreddit('realEstate');
//     const topPosts = await subreddit.getTop({time: 'week', limit: 3});
//     let data: { link: any; text: any; score: any; }[]= [];
//     topPosts.forEach((post: { url: any; title: any; score: any; }) => {
//         data.push({
//           link: post.url,
//           text: post.title,
//           score: post.score
//         })
//       });
//       console.log(data);
// }
function searchSubreddit(query, time, subreddit, sort) {
    snoowrap_1.requester.search({ query: query, time: time, subreddit: subreddit, sort: sort }).then(function (data) {
        console.log(data.toJSON());
        // TODO: Send to Backend
    });
}
