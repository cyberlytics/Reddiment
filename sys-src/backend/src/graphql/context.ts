import { IDatabase } from "../services/database";
import { getSentimentFunction } from "../services/sentiment";
import { ServiceStatusEnum } from "../services/serviceinterface";

type ServiceHealthInformation = {
    lastConnect?: Date,
    status: ServiceStatusEnum,
};

type Context = {
    db: IDatabase,
    sentiment: getSentimentFunction,
    health: Map<string, ServiceHealthInformation>,
};

export default Context;
export { ServiceHealthInformation };