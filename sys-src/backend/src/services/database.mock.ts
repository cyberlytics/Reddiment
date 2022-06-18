import { SimpleCache } from "../util/cache";
import { distinct } from "../util/list";
import { HealthCallback } from "./serviceinterface";
import { DbComment, IDatabase } from "./database";
import { date } from "../util/time";



type Comments = Array<DbComment>;

/**
 * A simple and very basic mock for Elasticsearch database
 */
class DbMock implements IDatabase {
    private readonly cache: SimpleCache;
    private readonly healthCallback: HealthCallback;

    constructor(healthCallback: HealthCallback) {
        this.cache = new SimpleCache();
        this.cache.set("comments", new Array<DbComment>());
        this.healthCallback = healthCallback;
        this.healthCallback("DOWN");
    }

    private comments(): Comments {
        this.healthCallback("UP");
        return this.cache.get<Comments>("comments")!;
    }

    public addComment(comment: DbComment): Promise<boolean> {
        this.comments().push(comment);
        return new Promise((r) => r(true));
    }

    private addCommentRaw(subreddit: string, text: string, timestamp: Date, sentiment: number): void {
        this.addComment({
            sentiment: sentiment,
            subreddit: subreddit,
            text: text,
            timestamp: timestamp,
            articleId: '',
            commentId: '',
            downvotes: 0,
            upvotes: 0,
            userId: '',
        });
    }

    public getSentiments(subreddit: string, from: Date, to: Date, keywords: Array<string>): Promise<Array<{ time: Date, sentiment: number }>> {
        return new Promise((r) => {
            const commentsOfSubreddit = this.comments().filter(c => c.subreddit == subreddit);
            const filtered = commentsOfSubreddit.filter(c => c.timestamp >= from &&
                c.timestamp <= to &&
                (keywords.length == 0 || keywords.some(kw => c.text.includes(kw))));
            r(filtered.map(c => { return { time: c.timestamp, sentiment: c.sentiment }; }));
        });
    }

    public getSubreddits(): Promise<Array<string>> {
        return new Promise((r) => r(distinct(this.comments().map(c => c.subreddit))));
    }

    public pingElastic(): Promise<boolean> {
        return new Promise((r) => r(true));
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