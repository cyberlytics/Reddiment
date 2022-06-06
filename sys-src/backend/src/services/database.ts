//import { Client } from '@elastic/elasticsearch';
const elasticsearch = require('@elastic/elasticsearch');

const client = new elasticsearch.Client({
    node: 'http://localhost:9200',
    auth: {
        username: 'elastic',
        password: 'test'
    }
})


async function getClusterInfo() {
    client.info()
        .then((response: any) => console.log(response))
}


async function ping() {
    console.log("ELASTICSEARCH: Trying to ping es");
    client.ping({}, {requestTimeout: 3000}).then((response: any, error: any) =>
    {if (response == true){
        console.log('ELASTICSEARCH: elasticsearch is up!')
    }else{
        console.log('ELASTICSEARCH: elasticsearch is down!') 
    }})
}



ping()