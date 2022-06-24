'use strict'

import {types} from "util";

const { Client } = require('@elastic/elasticsearch')
const client = new Client({
    node: 'http://localhost:9200',
    auth: {username: 'elastic', password: 'test'}
})



export async function ping(){
    const p = await client.ping({requestTimeout: 3000})
    console.log(p)
    /*if (!p){
        console.error('elasticsearch cluster is down!')
    }else{
        console.error('elasticsearch cluster is running!')
    }*/
}

