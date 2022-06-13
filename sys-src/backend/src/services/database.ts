import elasticsearch from '@elastic/elasticsearch';
import esb from 'elastic-builder'
import { HealthCallback } from './serviceinterface';
import dotenv from "dotenv";
import path from "path";

interface IDatabase {
    addComment: (comment: DbComment) => Promise<boolean>,
    getSentiments: (subreddit: string, from: Date, to: Date, keywords: Array<string>) => Promise<Array<TimeSentiment>>,
    getSubreddits: () => Promise<Array<string>>,
    pingElastic: () => Promise<boolean>,
};

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


class ElasticDb implements IDatabase {
    private readonly client: elasticsearch.Client;
    private readonly healthCallback: HealthCallback;
    private readonly host: string;
    private readonly user: string;
    private readonly password: string;

    constructor(healthCallback: HealthCallback) {
        this.healthCallback = healthCallback;
        //Get Secrets form  sys-src\docker\.env
        dotenv.config({path: path.resolve(__dirname.slice(0, -20)+"/docker/.env")});
        this.host = String(process.env.ELASTIC_HOST)
        this.user = String(process.env.ELASTIC_USER)
        this.password = String(process.env.ELASTIC_PASSWORD)
        //create Elastic Client
        this.client = new elasticsearch.Client({
            node: this.host,
            auth: {
                username: this.user,
                password: this.password,
            }
        })
    }

    /**
     * Function addComment() adds a new Comment to Elastic Database
     * Similar documents are stored with the same index in elastic
     * index == name of subreddit without "r/"
     * The id of an document is a unique identifier
     *
     * @param   {DbComment}  comment    the comment to add to the database
     * @returns {Promise<boolean>}      retuns true if the comment was successfully added to the database
     */
    public async addComment(comment: DbComment): Promise<boolean> {

        try {
            //delete "/r" from the index
            const idx_splitted = comment.subreddit.split("/", 2);
            const idx: string = idx_splitted[1];

            // add Comment to elastic database
            const result = await this.client.index({
                index: idx,
                document: {
                    text: comment.text,
                    timestamp: comment.timestamp,
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
            const idx_splitted = subreddit.split("/", 2);
            const idx: string = idx_splitted[1];
            //Keywords
            let keywordstring: string = keywords[0];
            for (let i = 1; i < (keywords.length); i++) {
                keywordstring += " " + keywords[i];
            };
            //Hier fehlt der Zeitraum

            //Create Request Body
            const requestBody = new esb.RequestBodySearch()
                .query(esb.boolQuery()
                    .must(new esb.MatchQuery('text', keywordstring))
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
            let respArray: any = [];
            await this.client.search({
                index: idx,
                size: 10000,
                body: requestBody.toJSON(),
                fields: ['text', 'timestamp', 'sentiment'],
            }).then(function (resp) {
                for (let i = 0; i < resp.hits.hits.length; i++) {
                    respArray.push(resp.hits.hits[i]);
                }
                return respArray;
            }, function (err) {
                console.trace(err.message);
            });

            // Create Array from type TimeSentiment
            let timeSentiment: Array<TimeSentiment> = [];
            for (let i = 0; i < respArray.length; i++) {
                timeSentiment[i] = {
                    time: respArray[i].fields.timestamp[0],
                    sentiment: respArray[i].fields.sentiment[0],
                };
            };

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
                const sr: string = "r/" + s.toString();
                //add Subreddit Name to Array
                subreddits.push(sr);
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
}


export { IDatabase, DbComment, TimeSentiment, ElasticDb };