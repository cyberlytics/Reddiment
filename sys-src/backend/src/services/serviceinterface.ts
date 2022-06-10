type ServiceStatusEnum = 'UP' | 'DOWN';

type HealthCallback = (status: ServiceStatusEnum) => void;

export { HealthCallback, ServiceStatusEnum };