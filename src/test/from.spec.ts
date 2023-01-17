import { RegExpBuilder } from '../regexp-builder';

describe('check from method work correctly.', () => {
    it('from have to receive initial value ( = first parameter )', () => {
        const current = new RegExpBuilder().from('from').getRawOne();
        expect(current).toBe('from');
    });

    it('from paramter can be subRegExpBuilder', async () => {
        const current = new RegExpBuilder()
            .from((qb) => {
                return qb.from('from').getRawOne();
            })
            .getRawOne();

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
