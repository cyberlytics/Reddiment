### _Readme for Snoowrap_

#### type prefixes
A fullname is a combination of a thing's type (e.g. Link) and its unique ID which forms a compact encoding of a globally unique ID on reddit.

Fullnames start with the type prefix for the object's type, followed by the thing's unique ID in base 36. For example, t3_15bfi0

```
t1_ : Comment
t2_ : Account
t3_ : Link
t4_ : Message
t5_ : Subreddit
t6_ : Award
```

#### Listing (https://not-an-aardvark.github.io/snoowrap/Listing.html)

Properties: `limit?`, `after?`, `before?`, `show?`, and `count?`
Members:
- `isFinished`: Boolean
    > A getter that indicates whether this Listing has any more items to fetch.

Methods: 
- `fetchMore(options)`
    > Fetches some more items
- `fetchAll([options])`
    > Fetches all of the items in this Listing, only stopping when there are none left.

Options:
- `amount`: Number
    > The number of items to fetch.
- `skipReplies`: Boolean, default: **false**
    > For a Listing that contains comment objects on a Submission, this option can be used to save a few API calls, provided that only top-level comments are being examined. If this is set to true, snoowrap is able to fetch 100 Comments per API call rather than 20, but all returned Comments will have no fetched replies by default.
    Internal details: When skipReplies is set to true, snoowrap uses reddit's api/info endpoint to fetch Comments. When skipReplies is set to false, snoowrap uses reddit's api/morechildren endpoint. It's worth noting that reddit does not allow concurrent requests to the api/morechildren endpoint by the same account.
- `append`: Boolean, default: **true**
    > If true, the resulting Listing will contain the existing elements in addition to the newly-fetched elements. If false, the resulting Listing will only contain the newly-fetched elements.

#### snoowrap
https://not-an-aardvark.github.io/snoowrap/snoowrap.html

The class for a snoowrap requester. A requester is the base object that is used to fetch content from reddit. Each requester contains a single set of OAuth tokens.

If constructed with a refresh token, a requester will be able to repeatedly generate access tokens as necessary, without any further user intervention. After making at least one request, a requester will have the `access_token` property, which specifies the access token currently in use. It will also have a few additional properties such as `scope` (an array of scope strings) and `ratelimitRemaining` (the number of requests remaining for the current 10-minute interval, in compliance with reddit's API rules.) These properties primarily exist for internal use, but they are exposed since they are useful externally as well.