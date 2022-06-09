import elasticsearch from '@elastic/elasticsearch';
import esb from 'elastic-builder'
import date from "../util/time";


interface IDatabase {
    addComment: (comment: DbComment) => Promise<boolean>,
    getSentiments: (subreddit: string, from: Date, to: Date, keywords: Array<string>) => Promise<Array<TimeSentiment>>,
    getSubreddits: () => Promise<Array<string>>,
    pingElastic: () => Promise<boolean>,

}

type DbComment = {
    subreddit: string,
    text: string,
    timestamp: Date,
    sentiment: number,
};

type TimeSentiment = {
    time: Date,
    sentiment: number,
};


class ElasticDb implements IDatabase {
    client: elasticsearch.Client;

    constructor() {
        //create elastic client
        this.client = new elasticsearch.Client({
            node: 'http://localhost:9200',
            auth: {
                username: 'elastic',
                password: 'test'
            }
        })
    }

    public async addComment(comment: DbComment): Promise<boolean> {
        /**
         * Similar documents are stored with the same index in elastic
         * index == name of subreddit without "r/"
         *   The id of an document is a unique identifier
         */

        try {
            //delete "/r" from the index
            const idx_splitted = comment.subreddit.split("/", 2)
            const idx: string = idx_splitted[1]

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

            if (result.result == 'created') {
                return true;
            } else {
                return false;
            }
        } catch (ex: any) {
            console.log(ex);
            return false;
        }

    }

    public async getSentiments(subreddit: string, from: Date, to: Date, keywords: string[]): Promise<Array<TimeSentiment>> {
        /**
         * Funktionsbeschreibung
         * function get Sentiments from elastic Database
         */
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
                        .gte('2022-06-09T12:00:00.000')
                        .lte('2022-06-09T13:00:00.000'))
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
            let timeSentiment: Array<TimeSentiment> = []
            for (let i = 0; i < respArray.length; i++) {
                timeSentiment[i] = {
                    time: respArray[i].fields.timestamp[0],
                    sentiment: respArray[i].fields.sentiment[0],
                };
            };

            return timeSentiment

        } catch (ex: any) {
            console.log(ex);

            const a: Array<TimeSentiment> = [{
                time: date("2020, 6, 7"),
                sentiment: 1,
            }, {
                time: date("2020, 6, 7"),
                sentiment: 1,
            }]
            return a
        }
    }


    public async getSubreddits(): Promise<Array<string>> {

        const a: Array<string> = ['test1', 'test2']
        return a
    }

    // Ping Elastic
    public async pingElastic(): Promise<boolean> {
        try {
            const response = await this.client.ping({}, {
                requestTimeout: 3000,
            })
            console.log(response);

            return true;

        } catch (ex: any) {
            console.log(ex);
            return false;
        }
    }
}



const cl = new ElasticDb();
const testcomment: DbComment = {
    subreddit: 'r/testtimestamp',
    text: 'the brown fox jumps over the lazy dog',
    timestamp: date("2022-06-10T13:00:00.000Z"),
    sentiment: 1,
};


cl.getSentiments('r/testtimestamp', date('2022-06-09T13:00:00.000') , new Date, ['fox', 'dog']).then((result) => { console.log(result) })



//cl.addComment(testcomment)
//    .then((result) => { console.log(result) })
//    .catch((err) => { console.log(err) });




export { IDatabase, DbComment, TimeSentiment, ElasticDb }