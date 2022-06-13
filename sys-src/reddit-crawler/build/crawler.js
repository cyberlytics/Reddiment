"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const snoowrap_1 = require("./snoowrap/snoowrap");
const express_1 = __importDefault(require("express"));
// Backend-Anbindung 
const app = (0, express_1.default)();
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
/**
 * Gets a Listing of new posts on this subreddit.
 */
snoowrap_1.requester.getSubreddit('r/wallstreetbets').getNew().then(data => {
    console.log("GETNEW: " + data);
    console.log("GETNEWJSON :" + data.toJSON());
    // TODO: Send to Backend
});
// crawler.getSubreddit('r/wallstreetbets').getNewComments().then(data => {
//     var allDataJSON = data.fetchAll({ amount: 10, append: true }).toJSON();
//     console.log("GETALL" + allDataJSON);
// })
snoowrap_1.requester.getSubreddit('r/wallstreetbets').getNewComments().then(data => {
    var allDataJSON = data.toJSON();
    console.log("NEWCOMMENTS: " + data);
    console.log("NEWCOMMENTSJSON: " + allDataJSON);
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
    snoowrap_1.requester.search({ query: query, time: time, subreddit: subreddit, sort: sort }).then((data) => {
        console.log(data.toJSON());
        // TODO: Send to Backend
    });
}
//# sourceMappingURL=crawler.js.map