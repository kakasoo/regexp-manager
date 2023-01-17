import { RegExpBuilder } from '../regexp-builder';

describe('check "and" method work correctly.', () => {
    it("and method have to add initial value's left side", () => {
        const leftHand = new RegExpBuilder('Hand').and('left').getRawOne();
        expect(leftHand).toBe('leftHand');
    });
});
