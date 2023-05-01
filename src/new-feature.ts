type Merge<F, S> = {
    [K in keyof (F & S)]: K extends keyof S ? S[K] : K extends keyof F ? F[K] : never;
};

class Builder<T extends Record<PropertyKey, any> = {}> {
    private readonly source: T;
    constructor(source: T) {
        this.source = source;
    }

    option<K extends PropertyKey, P>(key: K, value: P): Builder<Merge<Omit<T, K>, Record<K, P>>> {
        const newSource = { ...this.source, [key]: value };
        return new Builder<Omit<T, K> & Record<K, P>>(newSource);
    }

    get(): T {
        return this.source;
    }
}
