import { RegExpBuilder } from '../regexp-builder';
import { RegExpRepository } from '../regexp-repository';

describe('Check regexp-repository is type-safe', () => {
    it('getRepository return instance of repository', async () => {
        const repository = new RegExpBuilder().getRepository();

        expect(repository).toBeInstanceOf(RegExpRepository);
    });

    describe('repository findOne method from method', () => {
        it('from method set initial value to repository', async () => {
            const test = new RegExpBuilder().getRepository().findOne({
                from: 'test',
            });

            expect(test).toBe('test');
        });
    });
});
