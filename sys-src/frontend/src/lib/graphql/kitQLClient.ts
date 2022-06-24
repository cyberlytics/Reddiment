import { KitQLClient } from '@kitql/client';

export const kitQLClient = new KitQLClient({
    url: `/graphql`,
    headersContentType: 'application/json',
    logType: ['client', 'server', 'operationAndvariables']
});
