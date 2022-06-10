import DbMock from "../services/database.mock";
import { getSentimentFunction } from "../services/sentiment";
import { ServiceStatusEnum } from "../services/serviceinterface";

type ServiceHealthInformation = {
    lastConnect?: Date,
    status: ServiceStatusEnum,
};

type Context = {
    db: DbMock,
    sentiment: getSentimentFunction,
    health: Map<string, ServiceHealthInformation>,
};

export default Context;
export { ServiceHealthInformation };