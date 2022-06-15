import { ServiceStatusEnum } from "../services/serviceinterface";
import Context from "./context";
import Info from "./info";

type ServiceHealth = {
    name: string,
    lastConnect?: Date,
    status: ServiceStatusEnum,
};

const ServiceHealthQueryResolver = {
    health: (parent: {}, args: {}, context: Context, info: Info) => {
        const result = new Array<ServiceHealth>();
        context.health.forEach((h, name) => {
            result.push({
                name: name,
                status: h.status,
                lastConnect: h.lastConnect,
            });
        });
        return result;
    },
};


export { ServiceHealthQueryResolver };