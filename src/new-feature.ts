type Merge<F, S> = {
    [K in keyof (F & S)]: K extends keyof S ? S[K] : K extends keyof F ? F[K] : never;
};

type Length<T extends any[]> = T['length'];
type Push<T extends any[], V> = [...T, V];
type NTuple<N extends number, T extends any[] = []> = T['length'] extends N ? T : NTuple<N, Push<T, any>>;
type Add<N1 extends number, N2 extends number> = Length<[...NTuple<N1>, ...NTuple<N2>]>;
type Sub<A extends number, B extends number> = NTuple<A> extends [...infer U, ...NTuple<B>] ? Length<U> : never;
type NToNumber<N> = N extends number ? N : never;

export class RegExpPatternBuilder<
    Pattern extends Exclude<string, ''>,
    T extends Record<string, string>[] = [{ init: Pattern }],
    Depth extends number = 0,
> {
    private currentExpression: Pattern;
    private readonly status: T;

    constructor(currentExpression: Pattern, status: T = [{ init: currentExpression }] as Record<PropertyKey, any>) {
        this.currentExpression = currentExpression;
        this.status = status;
    }

    get expression(): Pattern {
        return this.currentExpression;
    }

    get path(): T {
        return this.status;
    }

    getRegExp(): RegExp {
        return RegExp(this.expression);
    }

    and(): any {}
    lessThan(): any {}
    lessThanOrEqual(): any {}
    moreThan(): any {}
    moreThanOrEqual(): any {}
    between(): any {}
    isOptional(): any {}
    includes(): any {}

    or<P extends string>(
        value: () => RegExpPatternBuilder<P>,
    ): RegExpPatternBuilder<`${Pattern}|${P}`, Push<T, { or: P }>, NToNumber<Add<Depth, 1>>>;
    or<P extends string>(
        value: P,
    ): RegExpPatternBuilder<`${Pattern}|${P}`, Push<T, { or: P }>, NToNumber<Add<Depth, 1>>>;

    or<P extends string>(value: P | (() => RegExpPatternBuilder<P>)) {
        if (typeof value === 'string') {
            const status = this.option<'or', P>('or', value);
            const expression: `${Pattern}|${P}` = `${this.expression}|${value}`;
            return new RegExpPatternBuilder(expression, status);
        } else {
            const subExpression = value().currentExpression;
            const status = this.option<'or', P>('or', subExpression);
            const expression: `${Pattern}|${P}` = `${this.expression}|${subExpression}`;
            return new RegExpPatternBuilder(expression, status);
        }
    }

    private option<K extends string, P>(key: K, value: P): [...T, Record<K, P>] {
        const process: Record<string, P> = { [key]: value };
        return [...this.status, process];
    }
}
