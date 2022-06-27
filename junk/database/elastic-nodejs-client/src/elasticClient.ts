//import {Client} from '@elastic/elasticsearch';
import {response} from "express";
import dotenv from 'dotenv';
import {data_got, query} from "../../el2/src/types";

//const { Client, BaseConnection } = require('@elastic/elasticsearch')

//export class elasticClient extends BaseConnection{
     // private client: Client;
//     //
//     //
//     // constructor() {
//     //
//     //
//     //     this.client = new Client({
//     //         node: 'http://localhost:9200',
//     //         auth: {username: 'elastic', password: 'test'},
//     //         requestTimeout: 30000,
//     //     });
//     // }
//
//
//
//
//     async getInfo(){
//         this.client.info()
//             .then((response)=> console.log(JSON.stringify((response))))
//             .catch((error) => console.log('No connection to elastic' + JSON.stringify(response)));
//     }
//
//     async ping(){
//         const p = await this.client.ping()
//             if (!p){
//                 console.error('elasticsearch cluster is down!')
//             }else{
//                 console.error('elasticsearch cluster is running!')
//             }
//     }
//
//     //Funktion zum Daten speichern
//     async saveData(d: data_got){
//         await this.client.index(d);
//         await this.client.indices.refresh({index: d.index})
//     }
//
//     async searchData(q: query){
//         const result = await this.client.search<Document>(q)
//
//         return result.hits.hits;
//     }
//
// }

