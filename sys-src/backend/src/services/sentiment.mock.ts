import { getSentimentFunction } from "./sentiment";

const getSentimentMock: getSentimentFunction = (text: string) => {
    return new Promise((resolve, reject) => {
        if (text === 'reject') {
            resolve(undefined);
        }
        else {
            resolve(Math.random());
        }
    });
};

export { getSentimentMock };