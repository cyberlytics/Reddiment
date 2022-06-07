import { KitQLClient } from '@kitql/client';

export const kitQLClient = new KitQLClient({
    url: `http://localhost:4000/graphql`,
    headersContentType: 'application/json',
    logType: ['client', 'server', 'operationAndvariables']
});
