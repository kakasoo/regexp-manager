import { RegExpBuilder } from '../regexp-builder';

describe('Check regexp-builder is type-safe', () => {
    describe('repository findOne method from method', () => {
        it('from method set initial value to repository', async () => {
            const test = new RegExpBuilder().findOne({
                from: 'test',
            });

            expect(test).toBe('test');
        });
    });

    describe('from & include infer response type', () => {
        it('from method set initial value & include other 1', () => {
            const test = new RegExpBuilder().findOne({
                from: 'test',
                include: { partial: 'left', options: {} },
            });

            expect(test).toBe('(?<=(left))(test)');
        });

        it('from method set initial value & include other 2', () => {
            const test = new RegExpBuilder().findOne({
                from: 'test',
                include: { partial: 'left', options: { isForehead: true } },
            });

            expect(test).toBe('(?<=(left))(test)');
        });

        it('from method set initial value & include other 3', () => {
            const test = new RegExpBuilder().findOne({
                from: 'test',
                include: { partial: 'right', options: { isForehead: false } },
            });

            expect(test).toBe('(test)(?=(right))');
        });
    });

    describe('from & lessThanEqual & moreThanEqual', () => {
        it('it will be "test{1,3}"', () => {
            const test = new RegExpBuilder().findOne({
                from: 'test',
                moreThanEqual: 1,
                lessThanEqual: 3,
            });

            expect(test).toBe('test{1,3}');
        });
    });

    describe('from & include & lessThanEqual & moreThanEqual', () => {
        it('it will be "test{1,3}"', () => {
            const test = new RegExpBuilder().findOne({
                from: 'test',
                // include: { partial: 'left', options: { isForehead: true } },
                include: { partial: 'left' },
                moreThanEqual: 1,
                lessThanEqual: 3,
            });

            expect(test).toBe('(?<=(left))(test){1,3}');
        });

        it('test 2.', () => {
            const test = new RegExpBuilder().findOne({
                from: 'hi',
                include: { partial: 'bye', options: { isForehead: true } },
                moreThanEqual: 1,
                lessThanEqual: 10,
            });

            expect(test).toBe('(?<=(bye))(hi){1,10}');
        });

        it('test 3.', () => {
            const test = new RegExpBuilder().findOne({
                from: 'www.kakasoo.com',
                include: { partial: 'https://', options: { isForehead: true } },
            });

            expect(test).toBe('(?<=(https://))(www.kakasoo.com)');
        });
    });
});
