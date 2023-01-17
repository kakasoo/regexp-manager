import { RegExpBuilder } from '../regexp-builder';

describe('check "and" method work correctly.', () => {
    it("and method have to add initial value's left side", () => {
        const leftHand = new RegExpBuilder('Hand').and('left').getRawOne();
        expect(leftHand).toBe('leftHand');
    });

    it('of course, it should be able to be added to the right as well.', async () => {
        const rightHand = new RegExpBuilder('right').and('Hand', { isForehead: false }).getRawOne();
        expect(rightHand).toBe('rightHand');
    });
});
