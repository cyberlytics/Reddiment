import elasticsearch from '@elastic/elasticsearch';

interface IDatabase {
    addComment: (comment: DbComment) => boolean,
    getSentiments: (subreddit: string, from: Date, to: Date, keywords: Array<string>) => Array<TimeSentiment>,
    getSubreddits: () => Array<string>,

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

const client = new elasticsearch.Client({
    node: 'http://localhost:9200',
    auth: {
        username: 'elastic',
        password: 'test'
    }
})



function getClusterInfo() {
    client.info()
        .then((response: any) => console.log(response))
}


function ping() {
    console.log("ELASTICSEARCH: Trying to ping es");
    client.ping({}, { requestTimeout: 3000 }).then((response: any, error: any) => {
        if (response == true) {
            console.log('ELASTICSEARCH: elasticsearch is up!')
        } else {
            console.log('ELASTICSEARCH: elasticsearch is down!')
        }
    })
}



export { IDatabase, DbComment, TimeSentiment };