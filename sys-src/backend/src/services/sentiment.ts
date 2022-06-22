const SentimentUrl = `http://${process.env.SENTIMENT_ADDR}/sentiment`;

type getSentimentFunction = (text: string) => Promise<Sentiment | undefined>;

type Sentiment = number;

/**
 *
 * @param {string} text A string to analyze.
 * @returns {Sentiment|undefined} A Sentiment value of the input text, or undefined if something went wrong.
 */
async function getSentiment(text: string): Promise<Sentiment | undefined> {
    try {
        const response = await fetch(SentimentUrl, {
            method: 'post',
            body: JSON.stringify({
                text: text
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.text();
        const sentiment = parseFloat(data);
        if (sentiment != Number.NaN) {
            return sentiment;
        }
        console.log('error', 'expected a number, got', sentiment);
        return undefined;
    }
    catch (e: any) {
        console.log('error', e);
        return undefined;
    }
}


export { Sentiment, getSentiment, getSentimentFunction };