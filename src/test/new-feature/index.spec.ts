import { RegExpBuilder } from '../../regexp-builder';
import assert from 'node:assert';
import { describe, it } from 'node:test';

describe('new-feature', () => {
    describe('node-version 20.1.0 check', () => {
        it('to be true', async () => {
            assert.deepStrictEqual(1, 1);
        });
    });
});
