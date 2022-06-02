import DbMock from "../services/database.mock";
import { getSentimentFunction } from "../services/sentiment";

type Context = {
    db: DbMock,
    sentiment: getSentimentFunction,
};

export default Context;