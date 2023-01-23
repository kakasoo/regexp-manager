import { RegExpBuilder } from '../src/regexp-builder';

type IncludeOptions = { isForehead?: boolean };
type AndOptions = { isForehead?: boolean };
type SubExpressionBilder<T extends string> = (subBuilder: RegExpBuilder) => T | string | RegExpBuilder;
type Push<T extends any[], val> = [...T, val];

type RegExpMethodNames = keyof typeof RegExpBuilder.prototype;
type Status<T extends RegExpMethodNames> = {
    name: T;
    value: T extends 'from'
        ? string
        : T extends 'whatever'
        ? string
        : T extends 'isOptional'
        ? string
        : T extends 'between'
        ? number[]
        : T extends 'moreThanEqual'
        ? number
        : T extends 'lessThanEqual'
        ? number
        : string;
    options: T extends 'include' ? IncludeOptions : T extends 'and' ? AndOptions : null;
    beforeStatus: string;
    order: number;
};
