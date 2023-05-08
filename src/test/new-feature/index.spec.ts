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

    it('or method have to add initial value as sub expression.', () => {
        const sringOrNumber = new RegExpPatternBuilder('[0-9]').or(() => new RegExpPatternBuilder('[a-zA-Z]'));
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
