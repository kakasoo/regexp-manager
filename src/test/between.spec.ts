import { RegExpBuilder } from '../regexp-builder';

describe('between', () => {
    it('1. string "cat" but lessThanEqual 3', () => {
        const pattern1 = new RegExpBuilder().from('(cat)').lessThanEqual(3).moreThanEqual(3).getRawOne();
        const pattern2 = new RegExpBuilder().from('(cat)').between(3, 3).getRawOne();

        expect(pattern1).toBe(pattern2);
    });
});
