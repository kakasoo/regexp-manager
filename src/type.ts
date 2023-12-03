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
export type LowercaseAlphabets = [
    'a',
    'b',
    'c',
    'd',
    'f',
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
export type UppercaseAlphabets = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
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

export type AlphabetTuple = [...UppercaseAlphabets, ...LowercaseAlphabets];
export type LowercaseAlphabet = LowercaseAlphabets[number];
export type UppercaseAlphabet = UppercaseAlphabets[number];
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
        ? X extends B
            ? [X, ...Slice<Rest, A, B, false>] // include A & CONDTION type is true
            : [X, ...Slice<Rest, A, B, true>] // include A & CONDTION type is true
        : Slice<Rest, A, B, false> // The first type parameter of the Slice type is the intermediate element of the tuple...
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
export type IsDigit<T extends string> = TupleIncludes<Digits, T>;

export type CaracterSet<T extends string> = T extends '' ? never : `[${T}]`;
export type Range<T extends string, P extends string> = `${T}-${P}`;

export type Take<T extends any[], P extends number, R extends any[] = []> = Length<R> extends P
    ? R
    : T extends [infer F, ...infer Rest]
    ? Take<Rest, P, Push<R, F>>
    : never;

export type UpperToLower<To extends string, N extends number> = Take<
    [...UppercaseAlphabets, ...Slice<LowercaseAlphabets, 'a', To>],
    N
>;
export type UpperToUpper<R1 extends string, R2 extends string, N extends number> = Take<
    Slice<UppercaseAlphabets, R1, R2>,
    N
>;

export type LowerToUpper<R1 extends string, R2 extends string, N extends number> = Take<
    Slice<LowercaseAlphabets, R1, R2>,
    N
>;

export type Digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
export type NumberToNumber<R1 extends string, R2 extends string, N extends number> = Take<Slice<Digits, R1, R2>, N>;

export type TupleToUnion<T extends NTuple<number>> = T[number];
export type IsCaracterSet<R2 extends string> = `[${R2}]` extends CaracterSet<infer R4>
    ? R4 extends Range<infer R5, infer R6>
        ? IsDigit<R5> extends true
            ? IsDigit<R6> extends true
                ? `${ToStringTuple<NumberToNumber<R5, R6, 1>>[number]}` // for example 'a-Z'
                : '' // one is digit, but the other isn't.
            : IsUpperCase<R5> extends true
            ? IsUpperCase<R6> extends true
                ? `${ToStringTuple<UpperToUpper<R5, R6, 1>>[number]}` // for example 'A-Z' // `${UpperToUpper<R5, R6>[number]}`
                : `${ToStringTuple<UpperToLower<R6, 1>>[number]}` // for example 'A-z'
            : IsLowerCase<R5> extends true
            ? IsUpperCase<R6> extends true
                ? never //  range reversed case, for example 'a-Z'. So, it will be never type
                : `${ToStringTuple<LowerToUpper<R5, R6, 1>>[number]}` // for example 'a-Z'
            : '' // one is digit, but the other isn't.
        : '' // Non-Alphabet, maybe it will be other languages or number (or never type)
    : ''; // Non-Range

/**
 * Means to repeat T string N times
 */
export type Repeat<T extends string, N extends number> = N extends 0 ? '' : `${T}${Repeat<T, Sub<N, 1>>}`;
export type NumberString<T extends number> = `${T}`;
export type ToNumberFromString<T extends string> = T extends NumberString<infer R> ? R : never;

export type _Prediction<
    Pattern extends string,
    BeforeString extends string = '',
> = Pattern extends `[${infer R1}]${infer R2}`
    ? `${BeforeString}${_Prediction<R2, IsCaracterSet<R1>>}`
    : Pattern extends `{${infer N1},${infer N2}}${infer R2}` // between N1 and N2, N2 can be empty string, so it will be above `more than` condtion`.
    ? _Prediction<R2, Repeat<BeforeString, ToNumberFromString<N1>>>
    : Pattern extends `{${infer N}}${infer R2}` // repeat `N` times
    ? _Prediction<R2, Repeat<BeforeString, ToNumberFromString<N>>>
    : Pattern extends `${infer R1}${infer R2}`
    ? `${BeforeString}${_Prediction<R2, R1>}`
    : `${BeforeString}${Pattern}`; // `Pattern` is empty string

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

export type StringIncludes<T extends string, P extends string> = T extends `${string}${P}${string}` ? true : false;
export type TupleIncludes<T extends readonly any[], U> = T extends [infer P, ...infer R] // T가 P와 나머지 R로 이루어진 배열이라면, 즉 length가 최소한 1 이상인 경우라면
    ? Equal<U, P> extends true
        ? true
        : TupleIncludes<R, U> // U가 P랑 같다면 true, 아니라면 Includes를 재귀적으로 호출한다.
    : false;
/**
 * It refers to a substitute string, and if there is an un substitute key-value pair, it is inferred as `never`.
 */
export type Replaced<T extends string> = StringIncludes<T, `\${${string}}`> extends true ? never : T;

export type RegExpTypeName =
    | Exclude<MethodNames<RegExpPatternBuilder<any>>, 'expression' | 'getRegExp'>
    | 'init'
    | 'lookahead'
    | 'lookbehind'
    | 'negativeLookahead'
    | 'negativeLookbehind';

export type EntriesToObject<T extends Array<NTuple<2>>> = T extends [infer F, ...infer Rest]
    ? F extends [infer K extends string, infer V]
        ? Rest extends NTuple<2>[]
            ? Merge<Record<K, V>, EntriesToObject<Rest>>
            : never
        : never
    : {};

export type NotAUnion<T, U = T> = U extends any ? ([T] extends [U] ? T : never) : never;

/**
 * T <= P 인 경우에는 true
 */
type _RightIsMoreThanOrEqualLeft<T extends any[], P extends any[]> = P extends [...T, ...infer Rest] ? true : false;

/**
 * number range
 *
 * @exmple 1-9 ok
 * @exmple 5-1 x  (right is less than left)
 * @exmple 2-2 ok (case which is left and right is equals)
 */
export type NumberRange<T extends number, P extends number> = _RightIsMoreThanOrEqualLeft<
    NTuple<T>,
    NTuple<P>
> extends true
    ? `${T}-${P}`
    : never | '`TO` HAVE TO BE BIGGER THAN `FROM`';
