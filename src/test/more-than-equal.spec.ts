import { RegExpBuilder } from '../regexp-builder';

describe('moreThanEqual', () => {
    it('1. string "a" but moreThanEqual 3', () => {
        const regExp = new RegExpBuilder().from('a').moreThanEqual(3).getOne();

        expect('a'.match(regExp)?.at(0) === 'a').toBe(false);
        expect('aa'.match(regExp)?.at(0) === 'aa').toBe(false);
        expect('aaa'.match(regExp)?.at(0) === 'aaa').toBe(true);

        expect('aaaa'.match(regExp)?.at(0) === 'aaaa').toBe(true);
        expect('aaaa'.match(regExp)?.at(0) === 'aaaa').toBe(true);
    });

    it('1. string "cat" but moreThanEqual 3', () => {
        const regExp = new RegExpBuilder().from('(cat)').moreThanEqual(3).getOne();

        expect('cat'.match(regExp)?.at(0) === 'cat').toBe(false);
        expect('catcat'.match(regExp)?.at(0) === 'catcat').toBe(false);
        expect('catcatcat'.match(regExp)?.at(0) === 'catcatcat').toBe(true);

        expect('catcatcatcat'.match(regExp)?.at(0) === 'catcatcatcat').toBe(true);
        expect('catcatcatcat'.match(regExp)?.at(0) === 'catcatcatcat').toBe(true);
    });
});
