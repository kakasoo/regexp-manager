import { RegExpBuilder } from '../regexp-builder';

describe('check include method work correctly.', () => {
    describe('include method work with isForehead true option', () => {
        it('includeForhead', () => {
            const includeRegExp = new RegExpBuilder().from('test').include('forehead', { isForehead: true }).getOne();
            const res = 'foreheadtest'.match(includeRegExp)?.at(0);
            expect(res).toBe('test');
        });
    });

    describe('include method work with isForehead false option', () => {
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
    });

    describe('include forehead & behind', () => {
        it('include forhead & behind 1.', () => {
            const includeRegExp = new RegExpBuilder()
                .from('mouse')
                .include('cat')
                .include('dog', { isForehead: false })
                .getOne();

            const res = 'catmousedog'.match(includeRegExp)?.at(0);
            expect(res).toBe('mouse');
        });
    });

    describe('andInclude method work correctly.', () => {
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
});
