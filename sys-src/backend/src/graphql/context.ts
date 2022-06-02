import { getSentimentFunction } from "../services/sentiment";
import DbMock from "../util/dbmock";

type Context = {
    db: DbMock,
    sentiment: getSentimentFunction,
};

export default Context;