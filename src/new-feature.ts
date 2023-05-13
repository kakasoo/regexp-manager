/**
 * util types
 */
type Merge<F, S> = {
    [K in keyof (F & S)]: K extends keyof S ? S[K] : K extends keyof F ? F[K] : never;
};

type Length<T extends any[]> = T['length'];
type Push<T extends any[], V> = [...T, V];
type NTuple<N extends number, T extends any[] = []> = T['length'] extends N ? T : NTuple<N, Push<T, any>>;

// type Add<N1 extends number, N2 extends number> = Length<[...NTuple<N1>, ...NTuple<N2>]>;
type Add<N1 extends number, N2 extends number> = [...NTuple<N1>, ...NTuple<N2>] extends [...infer U]
    ? Length<U>
    : never;

type Sub<A extends number, B extends number> = NTuple<A> extends [...infer U, ...NTuple<B>] ? Length<U> : never;
type NToNumber<N> = N extends number ? N : never;

type ToNumber<T> = T extends number ? T : never;
type ToString<T> = T extends string ? T : T extends number ? `${T}` : never;
type ToStringTuple<T> = T extends string[] ? T : never;
type Join<T extends string[], U extends string | number> = T extends [infer F, ...infer Rest]
    ? Rest extends []
        ? F
        : `${ToString<F>}${U}${Join<ToStringTuple<Rest>, U>}`
    : '';

/**
 * regexp types
 */
type OR<Expression extends string, P extends string> = `${Expression}|${P}`;
// type AND<Expression extends string, P extends string> = Join<[Expression, P], ''>;
type AND<Expression extends string, P extends string> = `${Expression}${P}`;
type LessThan<Expression extends string, Count extends number> = `${Expression}{1,${Sub<Count, 1>}}`;
type LessThanOrEqual<Expression extends string, Count extends number> = `${Expression}{1,${Count}}`;
type MoreThan<Expression extends string, Count extends number> = `${Expression}{${Add<Count, 1>},}`;
type MoreThanOrEqual<Expression extends string, Count extends number> = `${Expression}{${Count},}`;
type Optional<Expression extends string> = `${Expression}?`;
type Lookahead<Expression extends string, Condition extends string> = `${Expression}(?=${Condition})`;
type NegativeLookahead<Expression extends string, Condition extends string> = `${Expression}(?!${Condition})`;
type Lookbehind<Expression extends string, Condition extends string> = `(?<=${Condition})${Expression}`;
type NegativeLookbehind<Expression extends string, Condition extends string> = `(?<!${Condition})${Expression}`;
type CapturingGroup<Expression extends string> = `(${Expression})`;
type KoreanAlphabet = `[\\uac00-\\ud7a3]`; // 44032-55203
type AlphabetTuple = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
];
type LowercaseAlphabet = AlphabetTuple[number];
type UppercaseAlphabet = Uppercase<AlphabetTuple[number]>;
type Hexadecimal = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f';

namespace RegExpFlag {
    type HasIndices = 'd';
    type Global = 'g';
    type IgnoreCase = 'i';
    type Multiline = 'm';
    type DotAll = 's';
    type Unicode = 'u';
    type Sticky = 'y';
}

type MethodNames<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

type RegExpTypeName = Exclude<MethodNames<RegExpPatternBuilder<any>>, 'expression' | 'getRegExp'> | 'init';

export class RegExpPatternBuilder<
    Pattern extends Exclude<string, ''>,
    T extends Partial<Record<RegExpTypeName, string>>[] = [{ init: Pattern }],
    Depth extends number = 0,
> {
    private currentExpression: Pattern;
    private readonly status: T;

    constructor(currentExpression: Pattern = '' as Pattern, status: T = [{ init: currentExpression }] as any) {
        this.currentExpression = currentExpression;
        this.status = status;
    }

    get expression(): Pattern {
        return this.currentExpression;
    }

    get path(): T {
        return this.status;
    }

    /**
     * Check that the results of the two regular expression builders are the same.
     * Returns true if the final result is the same, even if it is made in different ways.
     *
     * @returns boolean
     */
    equals() {}

    getRegExp(): RegExp {
        return RegExp(this.expression);
    }

    /**
     * a letter or group that repeats less than that number
     * @param value limit
     */
    lessThan<P extends number>(
        value: P,
    ): RegExpPatternBuilder<LessThan<Pattern, P>, Push<T, { lessThan: `${P}` }>, NToNumber<Add<Depth, 1>>> {
        const operand: `${P}` = `${value}`;
        const status = this.option('lessThan', operand);
        const expression: LessThan<Pattern, P> = `${this.expression}{1,${(value - 1) as Sub<P, 1>}}`;
        return new RegExpPatternBuilder(expression, status);
    }

    lessThanOrEqual<P extends number>(
        value: P,
    ): RegExpPatternBuilder<
        LessThanOrEqual<Pattern, P>,
        Push<T, { lessThanOrEqual: `${P}` }>,
        NToNumber<Add<Depth, 1>>
    > {
        const operand: `${P}` = `${value}`;
        const status = this.option('lessThanOrEqual', operand);
        const expression: LessThanOrEqual<Pattern, P> = `${this.expression}{1,${value}}`;
        return new RegExpPatternBuilder(expression, status);
    }

    moreThan<P extends number>(
        value: P,
    ): RegExpPatternBuilder<MoreThan<Pattern, P>, Push<T, { moreThan: `${P}` }>, NToNumber<Add<Depth, 1>>> {
        const operand: `${P}` = `${value}`;
        const status = this.option('moreThan', operand);
        const addOne = (value + 1) as Add<P, 1>;
        const expression: MoreThan<Pattern, P> = `${this.expression}{${addOne},}`;
        return new RegExpPatternBuilder(expression, status);
    }

    moreThanOrEqual<P extends number>(
        value: P,
    ): RegExpPatternBuilder<
        MoreThanOrEqual<Pattern, P>,
        Push<T, { moreThanOrEqual: `${P}` }>,
        NToNumber<Add<Depth, 1>>
    > {
        const operand: `${P}` = `${value}`;
        const status = this.option('moreThanOrEqual', operand);
        const expression: MoreThanOrEqual<Pattern, P> = `${this.expression}{${value},}`;
        return new RegExpPatternBuilder(expression, status);
    }

    between(): any {}
    includes(): any {}
    join(): any {}

    optional<P extends string>(
        value: () => RegExpPatternBuilder<P, Record<string, string>[], number> | P,
    ): RegExpPatternBuilder<Optional<P>, Push<T, { optional: P }>, NToNumber<Add<Depth, 1>>>;
    optional<P extends string>(
        value: P,
    ): RegExpPatternBuilder<Optional<P>, Push<T, { optional: P }>, NToNumber<Add<Depth, 1>>>;
    optional<P extends string>(
        value: P | (() => RegExpPatternBuilder<P, Record<string, string>[], number> | P),
    ): RegExpPatternBuilder<Optional<P>, Push<T, { optional: P }>, NToNumber<Add<Depth, 1>>> {
        const operand = typeof value === 'string' ? value : this.getValue(value);
        const status = this.option('optional', operand);
        const expression: Optional<P> = `${operand}?`;
        return new RegExpPatternBuilder(expression, status);
    }

    capturing<P extends string>(
        value: () => RegExpPatternBuilder<P, Record<string, string>[], number> | P,
    ): RegExpPatternBuilder<CapturingGroup<P>, Push<T, { capturing: P }>, NToNumber<Add<Depth, 1>>>;
    capturing<P extends string>(
        value: P,
    ): RegExpPatternBuilder<CapturingGroup<P>, Push<T, { capturing: P }>, NToNumber<Add<Depth, 1>>>;
    capturing<P extends string>(
        value: P | (() => RegExpPatternBuilder<P, Record<string, string>[], number> | P),
    ): RegExpPatternBuilder<CapturingGroup<P>, Push<T, { capturing: P }>, NToNumber<Add<Depth, 1>>> {
        const operand = typeof value === 'string' ? value : this.getValue(value);
        const status = this.option('capturing', operand);
        const expression: CapturingGroup<P> = `(${operand})`;
        return new RegExpPatternBuilder(expression, status);
    }

    or<P extends string>(
        value: () => RegExpPatternBuilder<P, Record<string, string>[], number> | P,
    ): RegExpPatternBuilder<OR<Pattern, P>, Push<T, { or: P }>, NToNumber<Add<Depth, 1>>>;
    or<P extends string>(value: P): RegExpPatternBuilder<OR<Pattern, P>, Push<T, { or: P }>, NToNumber<Add<Depth, 1>>>;
    or<P extends string>(value: P | (() => RegExpPatternBuilder<P, Record<string, string>[], number> | P)) {
        const operand = typeof value === 'string' ? value : this.getValue(value);
        const status = this.option('or', operand);
        const expression: `${Pattern}|${P}` = `${this.expression}|${operand}`;
        return new RegExpPatternBuilder(expression, status);
    }

    and<P extends string>(
        value: () => RegExpPatternBuilder<P, Record<string, string>[], number> | P,
    ): RegExpPatternBuilder<AND<Pattern, P>, Push<T, { and: P }>, NToNumber<Add<Depth, 1>>>;
    and<P extends string>(
        value: P,
    ): RegExpPatternBuilder<AND<Pattern, P>, Push<T, { and: P }>, NToNumber<Add<Depth, 1>>>;
    and<P extends string>(value: P | (() => RegExpPatternBuilder<P, Record<string, string>[], number> | P)) {
        const operand = typeof value === 'string' ? value : this.getValue(value);
        const status = this.option('and', operand);
        const expression: `${Pattern}${P}` = `${this.expression}${operand}`;
        return new RegExpPatternBuilder(expression, status);
    }

    private getValue<P extends string>(value: () => RegExpPatternBuilder<P, Record<string, string>[], number> | P): P {
        const result = value();
        return typeof result === 'string' ? result : result.currentExpression;
    }

    private option<K extends RegExpTypeName, P>(key: K, value: P): [...T, Record<K, P>] {
        const process: Record<string, P> = { [key]: value };
        return [...this.status, process];
    }
}
