import { RegExpBuilder } from '../src/regexp-builder';

type IncludeOptions = { isForehead?: boolean };
type AndOptions = { isForehead?: boolean };
type SubExpressionBilder<T extends string> = (subBuilder: RegExpBuilder) => T | string | RegExpBuilder;
type Push<T extends any[], val> = [...T, val];

type Status<T = keyof typeof RegExpBuilder.prototype> = {
    name: T;
    value: string;
    options: T extends 'include' ? IncludeOptions : T extends 'and' ? AndOptions : null;
    beforeStatus: string;
    order: number;
};
