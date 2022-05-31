import { SimpleCache } from "./cache";
import { distinct } from "./list";
import date from "./time";


type DbComment = {
    subreddit: string,
    text: string,
    timestamp: Date,
    sentiment: number,
};

type DbComments = Array<DbComment>;

/**
 * A simple and very basic mock for Elasticsearch database
 */
class DbMock {
    private readonly cache: SimpleCache;

    constructor() {
        this.cache = new SimpleCache();
        this.cache.set("comments", new Array<DbComment>());
    }

    private comments(): DbComments {
        return this.cache.get<DbComments>("comments")!;
    }

    public addComment(subreddit: string, text: string, timestamp: Date, sentiment: number): void {
        this.comments().push({ subreddit, text, timestamp, sentiment });
    }

    public getSentiments(subreddit: string): Array<{ time: Date, sentiment: number }> {
        const commentsOfSubreddit = this.comments().filter(c => c.subreddit == subreddit);
        return commentsOfSubreddit.map(c => { return { time: c.timestamp, sentiment: c.sentiment }; });
    }

    public getSubreddits(): Array<string> {
        return distinct(this.comments().map(c => c.subreddit));
    }

    public initDummy(): void {
        this.addComment("r/wallstreetbets", "the brown fox jumps over the lazy dog", date("2022-05-27Z"), 0.76);
        this.addComment("r/wallstreetbets", "the red fox jumps over the lazy dog", date("2022-05-27Z"), 0.34);
        this.addComment("r/wallstreetbets", "the green fox jumps over the lazy dog", date("2022-05-27Z"), 0.12);
        this.addComment("r/wallstreetbets", "the blue fox jumps over the lazy dog", date("2022-05-27Z"), 0.50);
        this.addComment("r/wallstreetbets", "the black fox jumps over the lazy dog", date("2022-05-27Z"), 0.64);

        this.addComment("r/wallstreetbets", "the brown cat jumps over the lazy dog", date("2022-05-28Z"), 0.57);
        this.addComment("r/wallstreetbets", "the red dog jumps over the lazy dog", date("2022-05-28Z"), 0.64);
        this.addComment("r/wallstreetbets", "the green horse jumps over the lazy dog", date("2022-05-28Z"), 0.06);
        this.addComment("r/wallstreetbets", "the blue pig jumps over the lazy dog", date("2022-05-28Z"), 0.24);
        this.addComment("r/wallstreetbets", "the black chicken jumps over the lazy dog", date("2022-05-28Z"), 0.79);

        this.addComment("r/place", "the brown fox jumps over the fat dog", date("2022-05-27Z"), 0.31);
        this.addComment("r/place", "the red fox jumps over the lonely dog", date("2022-05-27Z"), 0.72);
        this.addComment("r/place", "the green fox jumps over the big dog", date("2022-05-28Z"), 0.87);
        this.addComment("r/place", "the blue fox jumps over the scared dog", date("2022-05-28Z"), 0.38);
        this.addComment("r/place", "the black fox jumps over the small dog", date("2022-05-28Z"), 0.04);

    }
}

export default DbMock;