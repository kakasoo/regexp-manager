import { RegExpBuilder } from '../regexp-builder';

describe('RegExpBuilder', () => {
    describe('check from method work correctly.', () => {
        it('from', () => {
            const current = new RegExpBuilder().from('from').currentExpression;
            expect(current).toBe('from');
        });

        it('from paramter can be subRegExpBuilder', async () => {
            const current = new RegExpBuilder().from((qb) => {
                return qb.from('from').currentExpression;
            }).currentExpression;

            expect(current).toBe('from');
        });

        // TODO : fix it.
        // it('cat in front of dog, dog in front of tree', () => {
        //     const regexp = new RegExpBuilder()
        //         .from((qb) => {
        //             return qb.from('cat').include('dog', { isForehead: true });
        //         })
        //         .include('tree', { isForehead: true })
        //         .getOne();

        //     console.log(regexp);
        //     expect(regexp.test('treedogcat')).toBe(true);
        // });
    });

    describe('includeForhead', () => {
        it('includeForhead', () => {
            const includeRegExp = new RegExpBuilder().from('test').include('forehead', { isForehead: true }).getOne();
            const res = 'foreheadtest'.match(includeRegExp)?.at(0);
            expect(res).toBe('test');
        });

        it('include forhead forhead (twice)', () => {
            const includeRegExp = new RegExpBuilder()
                .from('test')
                .include('[0-9]+', { isForehead: true })
                .andInclude('[a-z]+', { isForehead: true })
                .getOne();

            const res = 'cat123test'.match(includeRegExp)?.at(0);
            expect(res).toBe('test');
        });
    });

    describe('includeBehind', () => {
        it('includeBehind 1.', () => {
            const includeRegExp = new RegExpBuilder().from('test').include('behind', { isForehead: false }).getOne();
            const res = 'testbehind'.match(includeRegExp)?.at(0);
            expect(res).toBe('test');
        });

        it('includeBehind 2.', () => {
            const includeRegExp = new RegExpBuilder()
                .from('cat is behind of ')
                .include('dog', { isForehead: false })
                .getOne();

            const res = 'cat is behind of dog'.match(includeRegExp)?.at(0);
            expect(res).toBe('cat is behind of ');
        });

        it('get only protocol such as "https"', () => {
            const regExp = new RegExpBuilder().from('https').include('://', { isForehead: false }).getOne();
            const protocol = 'https://www.kakasoo.com/'.match(regExp).at(0);

            expect(protocol).toBe('https');
        });
    });

    describe('includeForhead & includeBehind', () => {
        it('include forhead & behind 1.', () => {
            const includeRegExp = new RegExpBuilder()
                .from('mouse')
                .include('cat')
                .include('dog', { isForehead: false })
                .getOne();

            const res = 'catmousedog'.match(includeRegExp)?.at(0);
            expect(res).toBe('mouse');
        });

        it('string after [0-9]+', () => {
            const includeRegExp = new RegExpBuilder().from('mouse').include('[0-9]+').getOne();

            const res = '12345mouse'.match(includeRegExp)?.at(0);
            expect(res).toBe('mouse');
        });

        it('check if url include "https://"', () => {
            const regexp = new RegExpBuilder().include('https://', { isForehead: true }).getOne();

            expect(regexp.test('www.kakasoo.com')).toBe(false);
            expect(regexp.test('https://www.kakasoo.com')).toBe(true);
        });

        it('url have to match string without host', () => {
            const regexp = new RegExpBuilder('.+').include('https://', { isForehead: true }).getOne();

            const urlWithoutProtocol = 'https://www.kakasoo.com'.match(regexp)?.at(0);
            expect(urlWithoutProtocol).toBe('www.kakasoo.com');
        });
    });

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

    describe('isOptional', () => {
        it('IsOptional should add a question mark symbol.', () => {
            const numbers = new RegExpBuilder().from('[0-9]').getOne();
            expect(numbers.test('1234')).toBe(true);
            expect(numbers.test('abcd')).toBe(false);

            const optionalNumbers = new RegExpBuilder().from('[0-9]').isOptional().getOne();
            expect(optionalNumbers.test('1234')).toBe(true);
            expect(optionalNumbers.test('abcd')).toBe(true);
        });
    });

    // TODO : need to be implemented AND statment, OR statement
    // describe('complicate problem', () => {
    //     it('make regexp to validate email', async () => {
    //         new RegExpBuilder('[a-z]')
    //     });
    // });
});
