import { RegExpPatternBuilder } from '../../new-feature';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import typia from 'typia';

describe('new-feature', () => {
    describe('node-version 20.1.0 check', () => {
        it('to be true', async () => {
            assert.deepStrictEqual(1, 1);
        });
    });
});

describe('check "or" method work correctly.', () => {
    it('or method have to add initial value as string.', () => {
        const leftOrRight = new RegExpPatternBuilder('left').or('right');
        assert.deepStrictEqual(leftOrRight.expression, 'left|right');
    });

    it('or method have to add initial value as string.', () => {
        const sringOrNumber = new RegExpPatternBuilder('[0-9]').or('[a-zA-Z]');
        assert.deepStrictEqual(sringOrNumber.expression, '[0-9]|[a-zA-Z]');
    });

    it('or method have to add initial value as sub expression(return builder).', () => {
        const sringOrNumber = new RegExpPatternBuilder('[0-9]').or(() => new RegExpPatternBuilder('[a-zA-Z]'));
        assert.deepStrictEqual(sringOrNumber.expression, '[0-9]|[a-zA-Z]');
    });

    it('or method have to add initial value as sub expression(return string).', () => {
        const sringOrNumber = new RegExpPatternBuilder('[0-9]').or(() => '[a-zA-Z]');
        assert.deepStrictEqual(sringOrNumber.expression, '[0-9]|[a-zA-Z]');
    });

    /**
     * Test code from previous version
     */
    // it('first parameter can be function returns string', () => {
    //     const leftOrRight = new RegExpPatternBuilder('left').or((qb) => {
    //         return qb
    //             .from('r')
    //             .and('i', { isForehead: false })
    //             .and('g', { isForehead: false })
    //             .and('h', { isForehead: false })
    //             .and('t', { isForehead: false })
    //             .getRawOne();
    //     }).expression;

    //     assert.deepStrictEqual(leftOrRight, 'left|right');
    // });

    /**
     * Test code from previous version
     */
    // it('first parameter can be function returns string', () => {
    //     const leftOrRight = new RegExpPatternBuilder('left').or((qb) => {
    //         return qb
    //             .from('r')
    //             .and('i', { isForehead: false })
    //             .and('g', { isForehead: false })
    //             .and('h', { isForehead: false })
    //             .and('t', { isForehead: false });
    //     }).expression;

    //     assert.deepStrictEqual(leftOrRight, 'left|right');
    // });
});

describe('check "and" method work correctly.', () => {
    it('and method have to add initial value as string.', () => {
        const leftAndRight = new RegExpPatternBuilder('left').and('right');
        assert.deepStrictEqual(leftAndRight.expression, 'leftright');
    });

    it('and method have to add initial value as string.', () => {
        const sringAndNumber = new RegExpPatternBuilder('[0-9]').and('[a-zA-Z]');
        assert.deepStrictEqual(sringAndNumber.expression, '[0-9][a-zA-Z]');
    });

    it('and method have to add initial value as sub expression(return builder).', () => {
        const sringAndNumber = new RegExpPatternBuilder('[0-9]').and(() => new RegExpPatternBuilder('[a-zA-Z]'));
        assert.deepStrictEqual(sringAndNumber.expression, '[0-9][a-zA-Z]');
    });

    it('and method have to add initial value as sub expression(return string).', () => {
        const sringAndNumber = new RegExpPatternBuilder('[0-9]').and(() => '[a-zA-Z]');
        assert.deepStrictEqual(sringAndNumber.expression, '[0-9][a-zA-Z]');
    });
});

describe('check "capturing" method work correctly.', () => {
    it('When capturing is used, the existing results are enclosed in brackets.', () => {
        const leftAndRight = new RegExpPatternBuilder().capturing(() => {
            return new RegExpPatternBuilder('left').and('right');
        });
        assert.deepStrictEqual(leftAndRight.expression, '(leftright)');
    });

    it('When capturing is used, the existing results are enclosed in brackets.', () => {
        const leftAndRight = new RegExpPatternBuilder().capturing(() => {
            return new RegExpPatternBuilder('left').and('right').expression;
        });
        assert.deepStrictEqual(leftAndRight.expression, '(leftright)');
    });

    it('capturing A or capturing B', () => {
        const capturingAOrB = new RegExpPatternBuilder()
            .capturing('A')
            .or(() => new RegExpPatternBuilder().capturing('B'));

        assert.deepStrictEqual(capturingAOrB.expression, '(A)|(B)');
    });
});

describe('test combining methods', () => {
    it('or, and', async () => {
        const colors = new RegExpPatternBuilder('red').and('orange').or('blue');
        assert.deepStrictEqual(colors.expression, 'redorange|blue');
    });
});
