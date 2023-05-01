type Merge<F, S> = {
    [K in keyof (F & S)]: K extends keyof S ? S[K] : K extends keyof F ? F[K] : never;
};

class Builder<T extends Record<PropertyKey, any>> {
    private readonly source: T;
    constructor(source: T = {} as Record<PropertyKey, any>) {
        this.source = source;
    }

    get(): T {
        return this.source;
    }

    or(): any {}
    and(): any {}
    lessThan(): any {}
    lessThanOrEqual(): any {}
    moreThan(): any {}
    moreThanOrEqual(): any {}
    between(): any {}
    isOptional(): any {}
    include(): any {}

    private option<K extends PropertyKey, P>(key: K, value: P): Builder<Merge<Omit<T, K>, Record<K, P>>> {
        const newSource = { ...this.source, [key]: value };
        return new Builder<Omit<T, K> & Record<K, P>>(newSource);
    }
}
