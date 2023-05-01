type Merge<F, S> = {
    [K in keyof (F & S)]: K extends keyof S ? S[K] : K extends keyof F ? F[K] : never;
};

class RegExpPatternBuilder<REGEXP extends string, T extends Record<PropertyKey, any>> {
    private currentExpression: REGEXP;
    private readonly source: T;
    constructor(currentExpression: REGEXP, source: T = {} as Record<PropertyKey, any>) {
        this.currentExpression = currentExpression;
        this.source = source;
    }

    get expression(): REGEXP {
        return this.expression;
    }

    get(): RegExp {
        return RegExp(this.currentExpression);
    }

    or<P extends string>(value: P): RegExpPatternBuilder<`${REGEXP}|${P}`, Merge<T, { or: P }>> {
        const source = this.option<'or', P>('or', value);
        return new RegExpPatternBuilder(`${this.currentExpression}|${value}`, source);
    }

    and(): any {}
    lessThan(): any {}
    lessThanOrEqual(): any {}
    moreThan(): any {}
    moreThanOrEqual(): any {}
    between(): any {}
    isOptional(): any {}
    includes(): any {}

    private option<K extends PropertyKey, P>(key: K, value: P): Merge<T, Record<K, P>> {
        return { ...this.source, [key]: value };
    }
}

// const a = new RegExpPatternBuilder('abc').or('value').get();
