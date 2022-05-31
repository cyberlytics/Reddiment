
class SimpleCache {
    private readonly data: Map<string, any>;

    constructor() {
        this.data = new Map<string, any>();
    }

    public set<T>(key: string, value: T): void {
        this.data.set(key, value);
    }

    public get<T>(key: string): T | undefined {
        if (this.data.has(key)) {
            return this.data.get(key) as T;
        }
        return undefined;
    }
}


export { SimpleCache };