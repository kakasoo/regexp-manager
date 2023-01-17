import { RegExpBuilder } from '../regexp-builder';

describe('lessThan', () => {
    it('1. string "a" but lessThanEqual 3', () => {
        const regExp = new RegExpBuilder().from('a').lessThanEqual(3).getOne();
        expect('a'.match(regExp)?.at(0) === 'a').toBe(true);
        expect('aa'.match(regExp)?.at(0) === 'aa').toBe(true);
        expect('aaa'.match(regExp)?.at(0) === 'aaa').toBe(true);

        expect('aaaa'.match(regExp)?.at(0) === 'aaa').toBe(true);
        expect('aaaa'.match(regExp)?.at(0) === 'aaaa').toBe(false);
    });

    it('1. string "cat" but lessThanEqual 3', () => {
        const regExp = new RegExpBuilder().from('(cat)').lessThanEqual(3).getOne();

        expect('cat'.match(regExp)?.at(0) === 'cat').toBe(true);
        expect('catcat'.match(regExp)?.at(0) === 'catcat').toBe(true);
        expect('catcatcat'.match(regExp)?.at(0) === 'catcatcat').toBe(true);

        expect('catcatcatcat'.match(regExp)?.at(0) === 'catcatcat').toBe(true);
        expect('catcatcatcat'.match(regExp)?.at(0) === 'catcatcatcat').toBe(false);
    });
});
