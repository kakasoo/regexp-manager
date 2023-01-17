import { RegExpBuilder } from '../regexp-builder';

describe('check "or" method work correctly.', () => {
    it('or method have to add initial value.', () => {
        const leftOrRight = new RegExpBuilder('left').or('right').getRawOne();
        expect(leftOrRight).toBe('left|right');
    });

    it('first parameter can be function returns string', () => {
        const leftOrRight = new RegExpBuilder('left')
            .or((qb) => {
                return qb
                    .from('r')
                    .and('i', { isForehead: false })
                    .and('g', { isForehead: false })
                    .and('h', { isForehead: false })
                    .and('t', { isForehead: false })
                    .getRawOne();
            })
            .getRawOne();

        expect(leftOrRight).toBe('left|right');
    });

    it('first parameter can be function returns string', () => {
        const leftOrRight = new RegExpBuilder('left')
            .or((qb) => {
                return qb
                    .from('r')
                    .and('i', { isForehead: false })
                    .and('g', { isForehead: false })
                    .and('h', { isForehead: false })
                    .and('t', { isForehead: false });
            })
            .getRawOne();

        expect(leftOrRight).toBe('left|right');
    });
});
