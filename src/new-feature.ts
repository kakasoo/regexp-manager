type Merge<F, S> = {
    [K in keyof (F & S)]: K extends keyof S ? S[K] : K extends keyof F ? F[K] : never;
};

class RegExpPatternBuilder<Pattern extends Exclude<string, ''>, T extends Record<PropertyKey, any> = {}> {
    private currentExpression: Pattern;
    private readonly source: T;

    constructor(currentExpression: Pattern, source: T = {} as Record<PropertyKey, any>) {
        this.currentExpression = currentExpression;
        this.source = source;
    }

    get expression(): Pattern {
        return this.currentExpression;
    }

    get path(): T {
        return this.source;
    }

    get(): RegExp {
        return RegExp(this.expression);
    }

    or<P extends string>(value: P): RegExpPatternBuilder<`${Pattern}|${P}`, Merge<T, { or: P }>> {
        const source = this.option<'or', P>('or', value);
        const expression: `${Pattern}|${P}` = `${this.expression}|${value}`;
        return new RegExpPatternBuilder(expression, source);
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

// const a = new RegExpPatternBuilder('asd').or('value').expression;
// const b = new RegExpPatternBuilder('').or('value').path;
// console.log(a);
