import elasticsearch from '@elastic/elasticsearch';
import date from "../util/time";

interface IDatabase {
    addComment: (comment: DbComment) => Promise<boolean>,
    getSentiments: (subreddit: string, from: Date, to: Date, keywords: Array<string>) => Promise<Array<TimeSentiment>>,
    getSubreddits: () => Promise<Array<string>>,

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

    //Function ingests a comment in elastic db
    public async addComment(comment: DbComment): Promise<boolean> {
        //Similar documents are stored with the same index in elastic
        //index == name of subreddit without "r/"
        //The id of an document is a unique identifier
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
    public async getSentiments(subreddit: string, from: Date, to: Date, keywords: string[]): Promise<Array<TimeSentiment>> {
        try {
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

}



const cl = new ElasticDb();
const testcomment: DbComment = {
    subreddit: 'r/test',
    text: 'the brown fox jumps over the lazy dog',
    timestamp: date("2020, 6, 7"),
    sentiment: 1,
};
cl.addComment(testcomment)
    .then((result) => { console.log(result) })
    .catch((err) => { console.log(err) });



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