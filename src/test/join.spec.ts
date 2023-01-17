import { RegExpBuilder } from '../regexp-builder';

describe('check "join method" work correctly.', () => {
    it(`from's subBuilder return join & it work expectly. (like as array.prototype.join)`, () => {
        const regexp = new RegExpBuilder()
            .from((qb) => {
                return qb.join([(qb) => qb.from('one'), qb.from('two').getRawOne(), 'three'], '|');
            })
            .getRawOne();

        expect(regexp).toBe('one|two|three');
    });
});
