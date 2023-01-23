import { SubExpressionBilder } from 'types';
import { RegExpBuilder } from './regexp-builder';

/**
 * A function that unravels a subBuilder and converts it all intro a string.
 */
export function slove<T extends string>(target: T | SubExpressionBilder<T>): T | string {
    if (typeof target === 'string') {
        return target;
    } else {
        const result = target(new RegExpBuilder());
        if (typeof result === 'string') {
            return result;
        } else {
            return result.getRawOne();
        }
    }
}
