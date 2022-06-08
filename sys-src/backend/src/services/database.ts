import elasticsearch from '@elastic/elasticsearch';
import { ElementFlags } from 'typescript';
import esb from 'elastic-builder'
import date from "../util/time";
import { estypes } from '@elastic/elasticsearch'

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

type Document = {
    _index: string,
    _id: string,
    _version: boolean,
    _seq_no: number,
    _primary_term: number,
    found: boolean,
    _source: {
        text: string,
        timestamp: Date,
        sentiment: number
    }
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

    //function get Sentiments from elastic Database
    //Funktion noch nicht fertig!!!!
    public async getSentiments(subreddit: string, from: Date, to: Date, keywords: string[]): Promise<Array<TimeSentiment>> {

        try {
            //Create Query
            //Index
            const idx_splitted = subreddit.split("/", 2)
            const idx: string = idx_splitted[1]
            //Keywords
            let keywordstring: string = keywords[0]
            for (let i = 1; i < (keywords.length); i++) {
                keywordstring += " " + keywords[i];
            }
            //console.log(keywordstring)

            //Hier fehlt der Zeitraum

            //Create Request Body
            const requestBody = new esb.RequestBodySearch().query(
                new esb.MatchQuery('text', keywordstring)
            );
            //log request body
            //console.log(requestBody.toJSON())

            //Get Data from elastic
            const response: estypes.SearchResponse = await this.client.search({
                index: idx,
                size: 10000,
                body: requestBody.toJSON(),
            });
            //get number of documents
            const num_documents = response.hits.hits.length;
            //get id's of documents whitch match the query
            let ids: Array<string> = []
            for (let i = 0; i < num_documents; i++) {
                ids[i] = response.hits.hits[i]._id
            }


            for (let i = 0; i < num_documents; i++) {
                let doc: estypes.GetResponse<Document> = await this.client.get({
                    index: idx,
                    id: ids[0],
                });
                //Funktion noch nicht fertig!!!!
                console.log(doc)
            }

            //-------------------------
            const a: Array<TimeSentiment> = [{
                time: date("2020, 6, 7"),
                sentiment: 1,
            }, {
                time: date("2020, 6, 7"),
                sentiment: 1,
            }]
            return a

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
    subreddit: 'r/test',
    text: 'the brown fox jumps over the lazy dog',
    timestamp: date("2020, 6, 7"),
    sentiment: 1,
};
cl.getSentiments('r/test', new Date, new Date, ['fox', 'dog'])

//cl.addComment(testcomment)
//    .then((result) => { console.log(result) })
//    .catch((err) => { console.log(err) });


//function ping() {
//    console.log("ELASTICSEARCH: Trying to ping es");
//    client.ping({}, { requestTimeout: 3000 }).then((response: any, error: any) => {
//        if (response == true) {
//            console.log('ELASTICSEARCH: elasticsearch is up!')
//        } else {
//            console.log('ELASTICSEARCH: elasticsearch is down!')
//        }
//    })
//}



export { IDatabase, DbComment, TimeSentiment, ElasticDb }