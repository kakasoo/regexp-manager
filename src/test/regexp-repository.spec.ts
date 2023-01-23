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
        it('from method set initial value & include other', () => {
            const test = new RegExpBuilder().findOne({
                from: 'test',
                include: { partial: 'left', options: {} },
            });

            expect(test).toBe('(test)(?=(left))');
        });
    });
});
