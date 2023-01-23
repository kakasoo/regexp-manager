import { IncludeOptions, SubExpressionBilder } from 'types';
import { RegExpBuilder } from './regexp-builder';

export class RegExpRepository {
    constructor() {}

    findOne<T extends string>({
        from,
        include = [],
        lessThanEqual,
        moreThanEqual,
    }: {
        from: T;
        include?: IncludeOptions[];
        lessThanEqual?: number;
        moreThanEqual?: number;
    }) {
        let expression = from;

        return expression;
    }
}
