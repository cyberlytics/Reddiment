import elasticsearch from '@elastic/elasticsearch';
import esb from 'elastic-builder'
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
    sentiment: number,
};

//Types Finance
type DbFinance = {
    aktie: string,
    timestamp: Date,
    open: number,
    high: number,
    low: number,
    close: number,
    adjClose: number,
    volume: number,
};

type TimeFinance = {
    time: Date,
    close: number,
};

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
        const host = process.env.ELASTIC_HOST || 'http://localhost:9200';
        const user = process.env.ELASTIC_USER || 'elastic';
        const password = process.env.ELASTIC_PASSWORD || 'test';
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
            const commendExist = await this.client.exists({
                index: idx,
                id: comment.commentId
            });

            if (commendExist == true) {
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
                            sentiment: comment.sentiment,
                        },
                        doc_as_upsert: true
                    }
                });
                //Refresh index
                await this.client.indices.refresh({ index: idx });
                this.healthCallback('UP');
                if (result.result == 'updated') {
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
                        sentiment: comment.sentiment,
                    }
                });
                //Refresh index
                await this.client.indices.refresh({ index: idx });
                this.healthCallback('UP');
                if (result.result == 'created') {
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

            //log request body
            //const util = require('util')
            //console.log(util.inspect(requestBody.toJSON(), {showHidden: false, depth: null, colors: true}))

            //Get Data from elastic and save response to respArray
            const respArray = new Array<elasticsearch.estypes.SearchHit<unknown>>();
            const resp = await this.client.search({
                index: idx,
                size: 10000,
                body: requestBody.toJSON(),
                fields: ['timestamp', 'sentiment'],
                _source: false,
            });

            for (let i = 0; i < resp.hits.hits.length; i++) {
                respArray.push(resp.hits.hits[i]);
            }

            // Create Array from type TimeSentiment
            const timeSentiment: Array<TimeSentiment> = [];
            respArray.forEach(r => {
                timeSentiment.push({
                    time: r.fields?.timestamp[0],
                    sentiment: r.fields?.sentiment[0],
                });
            })

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
                if (sr.startsWith("r_") == true) {
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
            const prefix: string = "f_"
            const teilen: string = "_"
            const fidx = prefix.concat(finance.aktie)
            //console.log(finance.aktie.concat(teilen, finance.timestamp.toDateString()))
            //Check if the stock already exists --> id
            const stockExist = await this.client.exists({
                index: fidx,
                id: finance.aktie.concat(teilen, finance.timestamp.toDateString()),
            });

            if (stockExist == true) {
                //Stock Exist --> Update Document
                const stockRes = await this.client.update({
                    index: fidx,
                    id: finance.aktie.concat(teilen, finance.timestamp.toDateString()),
                    body: {
                        doc: {
                            aktie: finance.aktie,
                            timestamp: finance.timestamp,
                            open: finance.open,
                            high: finance.high,
                            low: finance.low,
                            close: finance.close,
                            adjClose: finance.adjClose,
                            volume: finance.volume,
                        },
                        doc_as_upsert: true
                    }
                });

                //refresh Index
                await this.client.indices.refresh({ index: fidx });
                this.healthCallback('UP');
                if (stockRes.result == 'updated') {
                    return true;
                } else {
                    return false;
                }
            } else {
                // If Stock dosent exist --> add new Stock
                // add Stock to elastic database 
                const stockRes = await this.client.index({
                    index: fidx,
                    id: finance.aktie.concat(teilen, finance.timestamp.toDateString()),
                    document: {
                        aktie: finance.aktie,
                        timestamp: finance.timestamp,
                        open: finance.open,
                        high: finance.high,
                        low: finance.low,
                        close: finance.close,
                        adjClose: finance.adjClose,
                        volume: finance.volume,
                    }
                });
                //refresh Index
                await this.client.indices.refresh({ index: fidx });
                this.healthCallback('UP');
                if (stockRes.result == 'created') {
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
            //const prefix: string = "f_"
            //create request Body
            //const fidx = prefix.concat(stock);
            const fidx = stock
            let FboolQuery = esb.boolQuery();
            FboolQuery = FboolQuery.must(new esb.MatchQuery('aktie'));
            const requestFBody = new esb.RequestBodySearch()
                .query(FboolQuery
                    .must(new esb.RangeQuery('timestamp')
                        .gte(from.toISOString().slice(0, -1))
                        .lte(to.toISOString().slice(0, -1)))
                )

            //Get Data from elastic and save response
            const respFArray = new Array<elasticsearch.estypes.SearchHit<unknown>>();
            const Fresp = await this.client.search({
                index: fidx,
                size: 10000,
                body: requestFBody.toJSON(),
                fields: ['timestamp', 'close'],
                _source: false,
            });
            for (let n = 0; n < Fresp.hits.hits.length; n++) {
                respFArray.push(Fresp.hits.hits[n]);
            }

            // Create Array from type TimeFinance            
            const timeFinance: Array<TimeFinance> = [];
            respFArray.forEach(s => {
                timeFinance.push({
                    time: s.fields?.timestamp[0],
                    close: s.fields?.close[0],
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
                if (ar.startsWith('f_') == true) {
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
}


export { IDatabase, DbComment, TimeSentiment, ElasticDb, DbFinance };