import { SimpleCache } from "../util/cache";
import { distinct } from "../util/list";
import date from "../util/time";
import { DbComment, IDatabase } from "./database";



type Comments = Array<DbComment>;

/**
 * A simple and very basic mock for Elasticsearch database
 */
class DbMock implements IDatabase {
    private readonly cache: SimpleCache;

    constructor() {
        this.cache = new SimpleCache();
        this.cache.set("comments", new Array<DbComment>());
    }

    private comments(): Comments {
        return this.cache.get<Comments>("comments")!;
    }

    public addComment(comment: DbComment): boolean {
        this.comments().push(comment);
        return true;
    }

    private addCommentRaw(subreddit: string, text: string, timestamp: Date, sentiment: number): void {
        this.addComment({
            sentiment: sentiment,
            subreddit: subreddit,
            text: text,
            timestamp: timestamp,
        });
    }

    public getSentiments(subreddit: string, from: Date, to: Date, keywords: Array<string>): Array<{ time: Date, sentiment: number }> {
        const commentsOfSubreddit = this.comments().filter(c => c.subreddit == subreddit);
        const filtered = commentsOfSubreddit.filter(c => c.timestamp >= from &&
            c.timestamp <= to &&
            (keywords.length == 0 || keywords.some(kw => c.text.includes(kw))));
        return filtered.map(c => { return { time: c.timestamp, sentiment: c.sentiment }; });
    }

    public getSubreddits(): Array<string> {
        return distinct(this.comments().map(c => c.subreddit));
    }

    public initDummy(): void {
        this.addCommentRaw("r/wallstreetbets", "the brown fox jumps over the lazy dog", date("2022-05-27Z"), 0.76);
        this.addCommentRaw("r/wallstreetbets", "the red fox jumps over the lazy dog", date("2022-05-27Z"), 0.34);
        this.addCommentRaw("r/wallstreetbets", "the green fox jumps over the lazy dog", date("2022-05-27Z"), 0.12);
        this.addCommentRaw("r/wallstreetbets", "the blue fox jumps over the lazy dog", date("2022-05-27Z"), 0.50);
        this.addCommentRaw("r/wallstreetbets", "the black fox jumps over the lazy dog", date("2022-05-27Z"), 0.64);

        this.addCommentRaw("r/wallstreetbets", "the brown cat jumps over the lazy dog", date("2022-05-28Z"), 0.57);
        this.addCommentRaw("r/wallstreetbets", "the red dog jumps over the lazy dog", date("2022-05-28Z"), 0.64);
        this.addCommentRaw("r/wallstreetbets", "the green horse jumps over the lazy dog", date("2022-05-28Z"), 0.06);
        this.addCommentRaw("r/wallstreetbets", "the blue pig jumps over the lazy dog", date("2022-05-28Z"), 0.24);
        this.addCommentRaw("r/wallstreetbets", "the black chicken jumps over the lazy dog", date("2022-05-28Z"), 0.79);

        this.addCommentRaw("r/place", "the brown fox jumps over the fat dog", date("2022-05-27Z"), 0.31);
        this.addCommentRaw("r/place", "the red fox jumps over the lonely dog", date("2022-05-27Z"), 0.72);
        this.addCommentRaw("r/place", "the green fox jumps over the big dog", date("2022-05-28Z"), 0.87);
        this.addCommentRaw("r/place", "the blue fox jumps over the scared dog", date("2022-05-28Z"), 0.38);
        this.addCommentRaw("r/place", "the black fox jumps over the small dog", date("2022-05-28Z"), 0.04);
    }
}

export default DbMock;