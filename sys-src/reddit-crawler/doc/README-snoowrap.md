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

#### Listing
https://not-an-aardvark.github.io/snoowrap/Listing.html

A class representing a list of content. This is a subclass of the native Array object, so it has all the properties of an Array (length, forEach, etc.) in addition to some added methods. The Listing can be extended by using the `#fetchMore()` and `#fetchAll()` functions. Note that these methods return new Listings, rather than mutating the original Listing.

Most methods that return Listings will also accept `limit`, `after`, `before`, `show`, and `count` properties.

If you've used the reddit API before (or used other API wrappers like PRAW), you might know that reddit uses a `MoreComments` object in its raw JSON responses, representing comments that have been stubbed out of Listings. In snoowrap, there are no exposed `MoreComments` objects; the objects returned by the reddit API are stripped from Listings and are used internally as sources for the `fetchMore` functions. This means that in snoowrap, Listings that contain Comments can be used/expanded in the same manner as Listings that don't contain Comments, and for the most part you don't have to worry about the distinction.

(Incidentally, if you encounter a Listing that does contain a `MoreComments` object then it's a bug, so please report it.)

#### snoowrap
https://not-an-aardvark.github.io/snoowrap/snoowrap.html

The class for a snoowrap requester. A requester is the base object that is used to fetch content from reddit. Each requester contains a single set of OAuth tokens.

If constructed with a refresh token, a requester will be able to repeatedly generate access tokens as necessary, without any further user intervention. After making at least one request, a requester will have the `access_token` property, which specifies the access token currently in use. It will also have a few additional properties such as `scope` (an array of scope strings) and `ratelimitRemaining` (the number of requests remaining for the current 10-minute interval, in compliance with reddit's API rules.) These properties primarily exist for internal use, but they are exposed since they are useful externally as well.