import elasticsearch from '@elastic/elasticsearch';
import esb from 'elastic-builder';
import getSecret from '../util/secrets';
import { date } from '../util/time';
import { HealthCallback } from './serviceinterface';

interface IDatabase {
    addComment: (comment: DbComment) => Promise<boolean>,
    getSentiments: (subreddit: string, from: Date, to: Date, keywords: Array<string>) => Promise<Array<TimeSentiment>>,
    getSubreddits: () => Promise<Array<string>>,
    pingElastic: () => Promise<boolean>,
    addFinance: (finance: DbFinance) => Promise<boolean>,
    getFinance: (stock: string, from: Date, to: Date) => Promise<Array<TimeFinance>>,
    getStocks: () => Promise<Array<string>>,

};

//Types Comment
type DbComment = {
    subreddit: string,
    text: string,
    timestamp: Date,
    commentId: string,
    userId: string,
    articleId: string,
    upvotes: number,
    downvotes: number,
    sentiment: number,
};

type TimeSentiment = {
    time: Date,
    positive: number,
    negative: number,
    neutral: number,
};

//Types Finance
type DbFinance = {
    stock: string,
    timestamp: Date,
    open: number,
    high: number,
    low: number,
    close: number,
    volume: number,
};

type TimeFinance = {
    time: Date,
    close: number,
};

let secretPassword: string = 'password';
async function initSecrets() {
    secretPassword = (await getSecret('elastic_password')) || process.env.ELASTIC_PASSWORD || 'password';
}

/**
 * Class: ElasticDb
 *
 * Each document is stored under a unique ID.
 * Reddit Comment --> ID == commentId
 * Financial Data --> ID == ?
 *
 * Similar documents are stored with the same index in elastic.
 * Reddit Comment from subreddit "r/wallstreetbets" --> Index: r_wallstreetbest (Prefix "r_" indecates Comment of Subreddit)
 * Financial Data --> Index: f_xyz (Prefix "f_" indecates financial Data)
 */
class ElasticDb implements IDatabase {
    private readonly client: elasticsearch.Client;
    private readonly healthCallback: HealthCallback;

    constructor(healthCallback: HealthCallback) {
        this.healthCallback = healthCallback;
        const host = `http://${process.env.ELASTIC_ADDR || 'localhost:9200'}`;
        const user = process.env.ELASTIC_USERNAME || 'elastic';
        const password = secretPassword;

        //create Elastic Client
        this.client = new elasticsearch.Client({
            node: host,
            auth: {
                username: user,
                password: password,
            }
        });
    }

    /**
     * Function addComment() adds a new Comment to Elastic Database
     * Similar documents are stored with the same index in elastic
     * index == name of subreddit, substitute "/" with "_" --> "r_wallstreetbets"
     * The id of an document is a unique identifier --> commentId
     *
     * @param   {DbComment}  comment    the comment to add to the database
     * @returns {Promise<boolean>}      retuns true if the comment was successfully added to the database
     */
    public async addComment(comment: DbComment): Promise<boolean> {

        try {
            //substitite "/" with "_" for subreddit index
            const idx = comment.subreddit.replace("/", "_");
            //Check if the Comment already exists
            const commentExists = await this.client.exists({
                index: idx,
                id: comment.commentId
            });

            if (commentExists) {
                //Comment exists --> Update Document
                //Update Comment
                const result = await this.client.update({
                    index: idx,
                    id: comment.commentId,
                    body: {
                        doc: {
                            subreddit: comment.subreddit,
                            text: comment.text,
                            timestamp: comment.timestamp,
                            commentId: comment.commentId,
                            userId: comment.userId,
                            articleId: comment.articleId,
                            upvotes: comment.upvotes,
                            downvotes: comment.downvotes,
                            sentiment: comment.sentiment.toFixed(2),
                        },
                        doc_as_upsert: true
                    }
                });
                //Refresh index
                await this.client.indices.refresh({ index: idx });
                this.healthCallback('UP');
                if (result.result === 'updated' || result.result === 'noop') {
                    return true;
                } else {
                    return false;
                }

            } else {
                //Comment does not exist --> add new Comment
                // add Comment to elastic database
                const result = await this.client.index({
                    index: idx,
                    id: comment.commentId,
                    document: {
                        subreddit: comment.subreddit,
                        text: comment.text,
                        timestamp: comment.timestamp,
                        commentId: comment.commentId,
                        userId: comment.userId,
                        articleId: comment.articleId,
                        upvotes: comment.upvotes,
                        downvotes: comment.downvotes,
                        sentiment: comment.sentiment.toFixed(2),
                    }
                });
                //Refresh index
                await this.client.indices.refresh({ index: idx });
                this.healthCallback('UP');
                if (result.result === 'created') {
                    return true;
                } else {
                    return false;
                }
            }

        } catch (ex: any) {
            console.log(ex);
            this.healthCallback('DOWN');
            return false;
        }
    }

    /**
    * Function getSentiments() extract Sentiments from elastic Database
    *
    * @param   {string}      subreddit   Subreddit name
    * @param   {Date}        from        Start Timestamp for search
    * @param   {Date}        to          Stop Timestamp for search
    * @param   {string[]}    keywords    Array with the keywords for the search
    * @returns  {Array<TimeSentiment>}    Array with search results
    */
    public async getSentiments(subreddit: string, from: Date, to: Date, keywords: string[]): Promise<Array<TimeSentiment>> {
        try {
            //Create Query
            //Index
            const idx = subreddit.replace("/", "_");
            //Keywords
            let boolQuery = esb.boolQuery();
            if (keywords.length > 0) {
                boolQuery = boolQuery.must(new esb.MatchQuery('text', keywords.join(" ")));
            };
            //Create Request Body
            const requestBody = new esb.RequestBodySearch()
                .query(boolQuery
                    .must(new esb.RangeQuery('timestamp')
                        .gte(from.toISOString().slice(0, -1))
                        .lte(to.toISOString().slice(0, -1)))
                    //gte = Greater-than or equal to
                    //lte = Less-than or equal to
                )
                .agg(
                    esb.dateHistogramAggregation('dayagg', 'timestamp').fixedInterval('1d')
                        .agg(
                            esb.histogramAggregation('sentimentagg', 'sentiment.interpretation', 1)
                        )
                );

            const requestBodyObj = requestBody.toJSON();
            (requestBodyObj as any).runtime_mappings = {
                "sentiment.interpretation": {
                    "type": "double",
                    "script": 'double v = Double.parseDouble(doc[\'sentiment.keyword\'].value); if (v < -0.01) { emit(0); } else if (v > 0.01) { emit(2); } else { emit(1); }'
                }
            };

            //Get Data from elastic and save response to respArray
            const resp = await this.client.search({
                index: idx,
                size: 0, // No hits because we use aggregations
                body: requestBodyObj,
                fields: [], // No fields needed because of aggregations
                _source: false,
            });

            //Write resopnse Data in Array of type TimeSentiment
            const timeSentiment: Array<TimeSentiment> = [];
            const response: any = resp;
            response.aggregations.dayagg?.buckets.forEach((element: any) => {
                timeSentiment.push({
                    time: date(element.key_as_string),
                    positive: element.sentimentagg.buckets?.find((b: any) => b.key === 2)?.doc_count ?? 0,
                    neutral: element.sentimentagg.buckets?.find((b: any) => b.key === 1)?.doc_count ?? 0,
                    negative: element.sentimentagg.buckets?.find((b: any) => b.key === 0)?.doc_count ?? 0,
                });
            });

            this.healthCallback('UP');
            return timeSentiment;

        } catch (ex: any) {
            console.log(ex);
            this.healthCallback('DOWN');
            return [];
        }
    }

    /**
     * Function get Subreddits retuns an Array with contains all Subreddit names in Elastic Database.
     *
     * @returns {Promise<Array<string>>} Array with the Subreddit names
     */
    public async getSubreddits(): Promise<Array<string>> {
        try {
            //get indices from Database
            const response = await this.client.cat.indices({ format: 'json' });
            //Extract indices to Array
            let subreddits: Array<string> = [];
            for (let i = 0; i < response.length; i++) {
                const s: any = response[i].index;
                //add "r/" to subreddit Name
                const sr: string = s.toString();
                //Check if the index prefix is "r_"
                if (sr.startsWith("r_")) {
                    //add Subreddit Name to Array
                    subreddits.push(sr.replace("_", "/"));
                }
            }
            this.healthCallback('UP');
            return subreddits;

        } catch (ex: any) {
            console.log(ex);
            this.healthCallback('DOWN');
            return [];
        }
    }

    /**
    * Function delete a Comment by Index
    * Deleting an index deletes its documents, shards, and metadata.
    * @param    {string}    index       Index == r_subreddit
    * @returns  {Promise<boolean>}      Returns true if the Comment was successfully deleted
    */
    public async deleteComment(index: string): Promise<boolean> {
        try {
            //substitite "/" with "_" for subreddit index
            const idx = index.replace("/", "_");
            //delete the Index
            const resp = await this.client.indices.delete({
                index: idx,
            });

            this.healthCallback('UP');
            if (resp.acknowledged) {
                return true;
            } else {
                return false;
            }
        } catch (ex: any) {
            console.log(ex);
            this.healthCallback('DOWN');
            return false;
        }
    }

    /**
     * Fuction pingElastic() checks the connection to Elastic Database
     *
     * @returns {boolean}   retuns true if the Elastic Database is reachable
     */
    public async pingElastic(): Promise<boolean> {
        try {
            const response = await this.client.ping({}, {
                requestTimeout: 3000,
            });
            this.healthCallback('UP');
            return true;

        } catch (ex: any) {
            console.log(ex);
            this.healthCallback('DOWN');
            return false;
        }
    }

    /**
    * Function addFinance() adds new financial data to Elastic Database
    * Similar documents are stored with the same index in elastic
    * index == name of stock,  with prefix "f_" --> "f_XYZ"
    * The id of an document is a unique identifier --> stockname_timestamp
    *
    * @param   {DbFinance}  finance    the financial data to add to the database
    * @returns {Promise<boolean>}      retuns true if the financial data was successfully added to the database
     *
     */
    public async addFinance(finance: DbFinance): Promise<boolean> {
        try {
            // Noch nicht fertig -> genaue Daten fehlen
            const prefix: string = "f_";
            const teilen: string = "_";
            const fidx = prefix.concat(finance.stock.toLowerCase());
            //console.log(finance.stock.concat(teilen, finance.timestamp.toDateString()))
            //Check if the stock already exists --> id
            const stockExist = await this.client.exists({
                index: fidx,
                id: finance.stock.concat(teilen, finance.timestamp.toISOString()),
            });

            if (stockExist) {
                //Stock Exist --> Update Document
                const stockRes = await this.client.update({
                    index: fidx,
                    id: finance.stock.concat(teilen, finance.timestamp.toISOString()),
                    body: {
                        doc: {
                            stock: finance.stock,
                            timestamp: finance.timestamp,
                            open: finance.open.toFixed(2),
                            high: finance.high.toFixed(2),
                            low: finance.low.toFixed(2),
                            close: finance.close.toFixed(2),
                            volume: finance.volume.toFixed(2),
                        },
                        doc_as_upsert: true
                    }
                });

                //refresh Index
                await this.client.indices.refresh({ index: fidx });
                this.healthCallback('UP');
                if (stockRes.result === 'updated' || stockRes.result === 'noop') {
                    return true;
                } else {
                    return false;
                }
            } else {
                // If Stock dosent exist --> add new Stock
                // add Stock to elastic database
                const stockRes = await this.client.index({
                    index: fidx,
                    id: finance.stock.concat(teilen, finance.timestamp.toISOString()),
                    document: {
                        stock: finance.stock,
                        timestamp: finance.timestamp,
                        open: finance.open.toFixed(2),
                        high: finance.high.toFixed(2),
                        low: finance.low.toFixed(2),
                        close: finance.close.toFixed(2),
                        volume: finance.volume.toFixed(2),
                    }
                });
                //refresh Index
                await this.client.indices.refresh({ index: fidx });
                this.healthCallback('UP');
                if (stockRes.result === 'created') {
                    return true;
                } else {
                    return false;
                }
            }
        } catch (ex: any) {
            console.log(ex);
            this.healthCallback('DOWN');
            return false;
        }
    }

    /**
    * Function getFinance() extract financial data from elastic Database
    *
    * @param   {string}      stock          Stock name
    * @param   {Date}        from           Start Timestamp for search
    * @param   {Date}        to             Stop Timestamp for search
    * @returns {Array<TimeFinance>}         Array with search results
    */
    public async getFinance(stock: string, from: Date, to: Date,): Promise<Array<TimeFinance>> {
        try {
            //create Index with prefix
            const fidx = "f_" + stock.toLowerCase();
            //create query
            const queryFBody = new esb.RequestBodySearch()
                .query(esb.boolQuery()
                    .must(new esb.RangeQuery('timestamp')
                        .gte(from.toISOString().slice(0, -1))
                        .lte(to.toISOString().slice(0, -1)))
                )
                .sort(
                    esb.sort('timestamp', 'asc')
                );

            //Get Data from elastic and save response
            const respFArray = new Array<elasticsearch.estypes.SearchHit<unknown>>();
            const fresp = await this.client.search({
                index: fidx,
                size: 10000,
                body: queryFBody.toJSON(),
                fields: ['timestamp', 'close'],
                _source: false,
            });
            for (let n = 0; n < fresp.hits.hits.length; n++) {
                respFArray.push(fresp.hits.hits[n]);
            }

            // Create Array from type TimeFinance
            const timeFinance: Array<TimeFinance> = [];
            respFArray.forEach(s => {
                timeFinance.push({
                    time: date(s.fields?.timestamp[0]),
                    close: parseFloat(s.fields?.close[0]),
                });
            })
            this.healthCallback('UP');
            return timeFinance;

        } catch (ex: any) {
            console.log(ex);
            this.healthCallback('DOWN');
            return [];
        }
    }

    /**
    * Function getStocks retuns an Array with contains all Stock names in Elastic Database.
    *
    * @returns {Promise<Array<string>>} Array with the Stock names
    */
    public async getStocks(): Promise<Array<string>> {
        try {
            //get all indices from Database
            const responseF = await this.client.cat.indices({ format: 'json' });
            let stocks: Array<string> = [];
            for (let n = 0; n < responseF.length; n++) {
                const a: any = responseF[n].index;
                //add Stock Name to Array
                const ar: string = a.toString();
                //add Stock Name to Array
                if (ar.startsWith('f_')) {
                    //Delete prefix "f_"
                    stocks.push(ar.replace('f_', ''));
                }
            }

            this.healthCallback('UP');
            return stocks;

        } catch (ex: any) {
            console.log(ex);
            this.healthCallback('DOWN');
            return [];
        }
    }

    /**
    * Function delete Financial Data by Index
    * Deleting an index deletes its documents, shards, and metadata.
    * @param    {string}    stock       Index == f_Stockname
    * @returns  {Promise<boolean>}      Returns true if the Financial Data was successfully deleted
    */
    public async deleteFinance(stock: string): Promise<boolean> {
        try {
            //substitite "/" with "_" for subreddit index
            const prefix: string = "f_";
            const idx = prefix.concat(stock);
            //delete the document
            const resp = await this.client.indices.delete({
                index: idx,
            });

            this.healthCallback('UP');
            if (resp.acknowledged) {
                return true;
            } else {
                return false;
            }
        } catch (ex: any) {
            console.log(ex);
            this.healthCallback('DOWN');
            return false;
        }
    }
}

export { IDatabase, DbComment, TimeSentiment, ElasticDb, DbFinance, initSecrets };
