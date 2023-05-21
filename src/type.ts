import type { RegExpPatternBuilder } from './regexp-pattern-builder';

/**
 * util types
 */
export type Merge<F, S> = {
    [K in keyof (F & S)]: K extends keyof S ? S[K] : K extends keyof F ? F[K] : never;
};

export type Length<T extends any[]> = T['length'];
export type Push<T extends any[], V> = [...T, V];
export type NTuple<N extends number, T extends any[] = []> = T['length'] extends N ? T : NTuple<N, Push<T, any>>;

export type Add<N1 extends number, N2 extends number> = [...NTuple<N1>, ...NTuple<N2>] extends [...infer U]
    ? Length<U>
    : never;

export type Sub<A extends number, B extends number> = NTuple<A> extends [...infer U, ...NTuple<B>] ? Length<U> : never;
export type NToNumber<N> = N extends number ? N : never;

export type ToNumber<T> = T extends number ? T : never;
export type ToString<T> = T extends string ? T : T extends number ? `${T}` : never;
export type ToStringTuple<T> = T extends string[] ? T : never;
export type Join<T extends string[], U extends string | number> = T extends [infer F, ...infer Rest]
    ? Rest extends []
        ? F
        : `${ToString<F>}${U}${Join<ToStringTuple<Rest>, U>}`
    : '';

export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <P>() => P extends Y ? 1 : 2 ? true : false;

/**
 * regexp types
 */
export type Or<Expression extends string, P extends string> = `${Expression}|${P}`;
// export type AND<Expression extends string, P extends string> = Join<[Expression, P], ''>;
export type And<Expression extends string, P extends string> = `${Expression}${P}`;
export type LessThan<Expression extends string, Count extends number> = `${Expression}{1,${Sub<Count, 1>}}`;
export type LessThanOrEqual<Expression extends string, Count extends number> = `${Expression}{1,${Count}}`;
export type MoreThan<Expression extends string, Count extends number> = `${Expression}{${Add<Count, 1>},}`;
export type MoreThanOrEqual<Expression extends string, Count extends number> = `${Expression}{${Count},}`;
export type Between<
    Expression extends string,
    Count1 extends number,
    Count2 extends number,
> = `${Expression}{${Count1},${Count2}}`;
export type Optional<Expression extends string> = `${Expression}?`;
export type Lookahead<Expression extends string, Condition extends string> = `${Expression}(?=${Condition})`;
export type NegativeLookahead<Expression extends string, Condition extends string> = `${Expression}(?!${Condition})`;
export type Lookbehind<Expression extends string, Condition extends string> = `(?<=${Condition})${Expression}`;
export type NegativeLookbehind<Expression extends string, Condition extends string> = `(?<!${Condition})${Expression}`;
export type CapturingGroup<Expression extends string> = `(${Expression})`;
export type KoreanAlphabet = `[\\uac00-\\ud7a3]`; // 44032-55203
export type LowercaseAlphabetTuple = [
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
export type UppercaseAlphabetTuple = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
];
export type AlphabetTuple = [...UppercaseAlphabetTuple, ...LowercaseAlphabetTuple];
export type LowercaseAlphabet = LowercaseAlphabetTuple[number];
export type UppercaseAlphabet = UppercaseAlphabetTuple[number];
export type Hexadecimal = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f';

/**
 * Returns matching A to matching B in tuple form.
 * If there are no elements that match A or B, then never type.
 */
export type Slice<T extends any[], A extends any, B extends any, CONDITION extends boolean = false> = T extends [
    infer X,
    ...infer Rest,
]
    ? CONDITION extends true
        ? X extends B // If you find something that matches B,
            ? [X, ...Slice<Rest, A, B, false>] // End the option to include unconditionally if you find a match for B
            : [X, ...Slice<Rest, A, B, true>] // include next type unconditionally
        : X extends A // If you find something that matches A,
        ? [X, ...Slice<Rest, A, B, true>] // include A & CONDTION type is true
        : []
    : CONDITION extends true // If CONDITION is still true while circulating all arrays, then the last point was not found, so never
    ? never
    : [];

export type IsAlphabet<T extends string> = Uppercase<T> extends Lowercase<T>
    ? Lowercase<T> extends Uppercase<T>
        ? true
        : false
    : false;

export type IsUpperCase<T extends string> = Uppercase<T> extends T ? true : false;
export type IsLowerCase<T extends string> = Lowercase<T> extends T ? true : false;

export type UpperToLower<To extends string> = [...UppercaseAlphabetTuple, ...Slice<LowercaseAlphabetTuple, 'a', To>];

export type CaracterSet<T extends string> = `[${T}]`;
export type Range<T extends string, P extends string> = `${T}-${P}`;
export type TypedRegExp<Pattern extends string> = Pattern extends `${infer Prefix}${infer R1}${infer Postfix}`
    ? R1 extends CaracterSet<infer R2>
        ? R2 extends Range<infer R3, infer R4>
            ? IsUpperCase<R3> extends true
                ? IsUpperCase<R4> extends true
                    ? never // range reversed
                    : `${Prefix}${string}${Postfix}`
                : `${Prefix}${string}${Postfix}`
            : 'b'
        : 'c'
    : 'd';

type answer = TypedRegExp<'a[a-z]b'>;

export namespace RegExpFlag {
    export type HasIndices = 'd';
    export type Global = 'g';
    export type IgnoreCase = 'i';
    export type Multiline = 'm';
    export type DotAll = 's';
    export type Unicode = 'u';
    export type Sticky = 'y';
}

export type MethodNames<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

export type ReplaceAll<S extends string, From extends string, To extends string> = From extends ''
    ? S
    : S extends From
    ? To
    : S extends `${From}${infer Rest}`
    ? `${To}${ReplaceAll<Rest, From, To>}`
    : S extends `${infer First}${From}${infer Last}`
    ? `${First}${To}${ReplaceAll<Last, From, To>}`
    : S extends `${infer First}${From}`
    ? `${First}${To}`
    : S;

export type Includes<T extends string, P extends string> = T extends `${string}${P}${string}` ? true : false;

/**
 * It refers to a substitute string, and if there is an un substitute key-value pair, it is inferred as `never`.
 */
export type Replaced<T extends string> = Includes<T, `\${${string}}`> extends true ? never : T;

export type RegExpTypeName =
    | Exclude<MethodNames<RegExpPatternBuilder<any>>, 'expression' | 'getRegExp'>
    | 'init'
    | 'lookahead'
    | 'lookbehind'
    | 'negativeLookahead'
    | 'negativeLookbehind';
